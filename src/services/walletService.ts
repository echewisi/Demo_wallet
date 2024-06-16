import knex from "knex";
import bcrypt from "bcrypt";
import config from "../../knexfile";
import { User } from "../models/userModel";
import { getWalletByUserId, updateWalletBalance, createTransaction } from "../models/walletModel";
import { getUserById } from "../models/userModel";


const db = knex(config.development);


/**
 * 
 * @param userId:  this is the id of the user. in this context the uuid stands as the 
 *                 account number of user
 * @param amount:   this is the amount(in fiat) that is to transferred into the user's wallet
 * @param password:    the pass key/token of the user that enables authorization on the action to be carried on
 *                     in this service
 * @returns:  a successs message  is returned stating the successful completion of transaction(in this context-> funding). anything otherwise would throw an error
 */
export const fundAccountService = async (userId: string, amount: number, password: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password.");
  }

  await updateWalletBalance(userId, amount);
  return { success: true, message: "Account funded successfully!" };
};

  /**
   * 
   * @param userId: this is the id of the user. in this context the uuid stands as the 
 *                 account number of user
   * @param recipientId : this is the id of the recepient of the fund transfer transaction
   * @param amount: this is the amount that is to be sent across to the recepient's wallet 
   * @param password: the password of the individual enabling in the transaction(in this context-> fund transfer) 
   * @returns: a success message is returned when transaction (context-> funds transfer) is successful
   */
  export const transferFundsService = async (userId: string, recipientId: string, amount: number, password: string) => {
    const user = await getUserById(userId);
  
    if (!user) {
      throw new Error("User not found.");
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      throw new Error("Invalid password.");
    }
  
    const senderWallet = await getWalletByUserId(userId);
    const recipientWallet = await getWalletByUserId(recipientId);
  
    if (!senderWallet || !recipientWallet) {
      throw new Error("Sender or recipient wallet not found.");
    }
  
    if (senderWallet.balance < amount) {
      throw new Error("Insufficient balance.");
    }
  
    await db.transaction(async (trx) => {
      await trx("wallets").where({ user_id: userId }).decrement("balance", amount);
      await trx("wallets").where({ user_id: recipientId }).increment("balance", amount);
      await createTransaction(senderWallet.id, recipientWallet.id, amount, "transfer");
    });
  
    return { success: true, message: "Transfer successful." };
  };


 /**
   * 
   * @param userId: this is the id of the user. in this context the uuid stands as the 
 *                 account number of user
   * @param amount: this is the amount that is to be withdrawn from user's wallet 
   * @param password: the password of the individual enabling in the transaction(in this context-> fund withdrawal) 
   * @returns: this returns a success message if the withdrawal is successful and an error if the operation fails(dependent on cause)
   */
  
 export const withdrawFundsService = async (userId: string, amount: number, password: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password.");
  }

  const wallet = await getWalletByUserId(userId);

  if (!wallet) {
    throw new Error("Wallet not found.");
  }

  if (wallet.balance < amount) {
    throw new Error("Insufficient balance.");
  }

  await updateWalletBalance(userId, -amount);
  return { success: true, message: "Withdrawal successful." };
};

