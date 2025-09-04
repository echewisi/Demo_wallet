import knex from "knex";
import bcrypt from "bcrypt";
import config from "../knexfile";

import {
  getWalletById,
  getWalletByUserId,
  incrementWalletBalance,
  decrementWalletBalance,

} from "../models/walletModel";
import { getUserById } from "../models/userModel";
import { validateWalletOperation } from "../utils/validation";
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  InsufficientFundsError,
  DatabaseError
} from "../utils/errors";


const db = knex(config['production']!);



/**
 *
 * @param userId:  the userid of the user would be used to retrieve the respective wallet_id of the user that is to funded.
 * @param amount:   this is the amount(in fiat) that is to transferred into the user's wallet
 * @param password:    the pass key/token of the user that enables authorization on the action to be carried on
 *                     in this service
 * @returns:  a successs message  is returned stating the successful completion of transaction(in this context-> funding). anything otherwise would throw an error
 */
export const fundAccountService = async (
  userId: string,
  amount: number,
  password: string
): Promise<{ success: boolean; message: string; newBalance: number }> => {
  try {
    // Validate input data
    const validation = validateWalletOperation({ userId, amount, password });
    if (!validation.isValid) {
      throw new ValidationError(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Get user and wallet
    const [user, wallet] = await Promise.all([
      getUserById(userId),
      getWalletByUserId(userId)
    ]);

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid password");
    }

    // Increment wallet balance
    await incrementWalletBalance(wallet.wallet_id, amount);
    
    // Get updated balance
    const updatedWallet = await getWalletById(wallet.wallet_id);
    const newBalance = updatedWallet?.balance || 0;

    return { 
      success: true, 
      message: "Account funded successfully!",
      newBalance
    };
  } catch (error) {
    if (error instanceof ValidationError || 
        error instanceof AuthenticationError || 
        error instanceof NotFoundError) {
      throw error;
    }
    console.error(`Unexpected error funding account: ${error}`);
    throw new DatabaseError("Failed to fund account");
  }
};

/**
 *
 * @param userId: this is the id of the user. the user id would be used to find and access the wallet of the user
 *   
 * @param recipient_wallet_Id : this is the id of the recepient of the fund transfer transaction
 * @param amount: this is the amount that is to be sent across to the recepient's wallet
 * @param password: the password of the individual enabling in the transaction(in this context-> fund transfer)
 * @returns: a success message is returned when transaction (context-> funds transfer) is successful
 */
export const transferFundsService = async (
  userId: string, 
  recipientWalletId: string, 
  amount: number, 
  password: string
): Promise<{ success: boolean; message: string; transactionId?: string | undefined }> => {
  try {
    // Validate input data
    const validation = validateWalletOperation({ 
      userId, 
      amount, 
      password, 
      recipientWalletId 
    });
    if (!validation.isValid) {
      throw new ValidationError(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Get user and wallets
    const [user, senderWallet, recipientWallet] = await Promise.all([
      getUserById(userId),
      getWalletByUserId(userId),
      getWalletById(recipientWalletId)
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!senderWallet) {
      throw new NotFoundError("Sender wallet not found");
    }

    if (!recipientWallet) {
      throw new NotFoundError("Recipient wallet not found");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid password");
    }

    // Check sufficient balance
    if (senderWallet.balance < amount) {
      throw new InsufficientFundsError("Insufficient balance for transfer");
    }

    // Prevent self-transfer
    if (senderWallet.wallet_id === recipientWalletId) {
      throw new ValidationError("Cannot transfer funds to the same wallet");
    }

    console.log('Starting transfer transaction...');
    
    // Use database transaction for atomicity
    const result = await db.transaction(async (trx) => {
      console.log('Transfer transaction started');
      console.log(`Sender: ${senderWallet.wallet_id}, Recipient: ${recipientWalletId}, Amount: ${amount}`);
      
      // Decrement sender balance
      await trx("wallets")
        .where({ wallet_id: senderWallet.wallet_id })
        .decrement("balance", amount);
      
      // Increment recipient balance
      await trx("wallets")
        .where({ wallet_id: recipientWalletId })
        .increment("balance", amount);
      
      // Create transaction record
      const [transactionId] = await trx("transactions").insert({
        from_wallet_id: senderWallet.wallet_id,
        to_wallet_id: recipientWalletId,
        amount,
        type: "transfer"
      });

      return transactionId;
    });

    console.log('Transfer transaction completed successfully');
    return { 
      success: true, 
      message: "Transfer successful.",
      transactionId: result ? result.toString() : undefined
    };
  } catch (error) {
    if (error instanceof ValidationError || 
        error instanceof AuthenticationError || 
        error instanceof NotFoundError ||
        error instanceof InsufficientFundsError) {
      throw error;
    }
    console.error(`Unexpected error transferring funds: ${error}`);
    throw new DatabaseError("Failed to transfer funds");
  }
};

/**
 *
 * @param userId: this is the id of the user. in this context the uuid stands as the
 *                 account number of user
 * @param amount: this is the amount that is to be withdrawn from user's wallet
 * @param password: the password of the individual enabling in the transaction(in this context-> fund withdrawal)
 * @returns: this returns a success message if the withdrawal is successful and an error if the operation fails(dependent on cause)
 */

export const withdrawFundsService = async (
  userId: string,
  amount: number,
  password: string
): Promise<{ success: boolean; message: string; newBalance: number }> => {
  try {
    // Validate input data
    const validation = validateWalletOperation({ userId, amount, password });
    if (!validation.isValid) {
      throw new ValidationError(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Get user and wallet
    const [user, wallet] = await Promise.all([
      getUserById(userId),
      getWalletByUserId(userId)
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!wallet) {
      throw new NotFoundError("Wallet not found");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid password");
    }

    // Check sufficient balance
    if (wallet.balance < amount) {
      throw new InsufficientFundsError("Insufficient balance for withdrawal");
    }

    // Decrement wallet balance
    await decrementWalletBalance(wallet.wallet_id, amount);
    
    // Get updated balance
    const updatedWallet = await getWalletById(wallet.wallet_id);
    const newBalance = updatedWallet?.balance || 0;

    return { 
      success: true, 
      message: "Withdrawal successful.",
      newBalance
    };
  } catch (error) {
    if (error instanceof ValidationError || 
        error instanceof AuthenticationError || 
        error instanceof NotFoundError ||
        error instanceof InsufficientFundsError) {
      throw error;
    }
    console.error(`Unexpected error withdrawing funds: ${error}`);
    throw new DatabaseError("Failed to withdraw funds");
  }
};
