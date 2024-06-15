import knex from "knex";
import bcrypt from "bcrypt";
import config from "../../knexfile";
import { User } from "../models/userModel";


const db = knex(config.development);


/**
 * 
 * @param userId:  this is the id of the user. in this context the uuid stands as the 
 *                 account number of user
 * @param amount:   this is the amount(in fiat) that is to transferred into the user's wallet
 * @param password:    the pass key/token of the user that enables authorization on the action to be carried on
 *                     in this service
 * @returns:   a successs message stating the successful completion of transaction(in this context-> funding). anything otherwise would throw an error
 */
export const fundAccountService = async (userId: string, amount: number, password: string) => {
    const user = await db<User>("users").where({ id: userId }).first();
  
    if (!user) {
      throw new Error("User not found.");
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      throw new Error("Invalid password.");
    }
  
    await db("wallets").where({ user_id: userId }).increment("balance", amount);
    return { success: true, message: "Account funded successfully." };
  };



  /**
   * 
   * @param userId: this is the id of the user. in this context the uuid stands as the 
 *                 account number of user
   * @param recipientId : this is the id of the recepient of the fund transfer transaction
   * @param amount: this is the amount that is to be sent across to the recepient's wallet 
   * @param password: the password of the individual enabling in the transaction(in this context-> fund transfer) 
   * @returns 
   */
  export const transferFundsService = async (userId: string, recipientId: string, amount: number, password: string) => {
    const user = await db<User>("users").where({ id: userId }).first();
  
    if (!user) {
      throw new Error("User not found.");
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      throw new Error("Invalid password.");
    }
  
    const senderWallet = await db("wallets").where({ user_id: userId }).first();
    const recipientWallet = await db("wallets").where({ user_id: recipientId }).first();
  
    if (senderWallet.balance < amount) {
      throw new Error("Insufficient balance.");
    }
  
    await db("wallets").where({ user_id: userId }).decrement("balance", amount);
    await db("wallets").where({ user_id: recipientId }).increment("balance", amount);
    await db("transactions").insert({
      from_wallet_id: senderWallet.id,
      to_wallet_id: recipientWallet.id,
      amount,
      type: "transfer",
    });
  
    return { success: true, message: "Transfer successful." };
  };


  
  export const withdrawFundsService = async (userId: string, amount: number, password: string) => {
    const user = await db<User>("users").where({ id: userId }).first();
  
    if (!user) {
      throw new Error("User not found.");
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      throw new Error("Invalid password.");
    }
  
    const wallet = await db("wallets").where({ user_id: userId }).first();
  
    if (wallet.balance < amount) {
      throw new Error("Insufficient balance.");
    }
  
    await db("wallets").where({ user_id: userId }).decrement("balance", amount);
    return { success: true, message: "Withdrawal successful." };
  };
  