import knex from "knex";
import config from "../knexfile";
import { v4 as uuidv4 } from "uuid";

const db = knex(config.production);

interface Wallet {
  id: string;
  user_id: string;
  balance: number;
}

const incrementWalletBalance = async (walletId: string, amount: number): Promise<void> => {
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount. Amount must be a positive number.');
  }

  await db('wallets').where({ id: walletId }).increment('balance', amount);
};

const decrementWalletBalance = async (walletId: string, amount: number): Promise<void> => {
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount. Amount must be a positive number.');
  }

  const wallet = await db('wallets').where({ id: walletId }).first();
  
  if (!wallet) {
    throw new Error('Wallet not found.');
  }
  
  if (wallet.balance < amount) {
    throw new Error('Insufficient balance.');
  }

  await db('wallets').where({ id: walletId }).decrement('balance', amount);
};

const getWalletByUserId = async (userId: string): Promise<Wallet | undefined> => {
  return db('wallets').where({ user_id: userId }).first();
}

const getWalletById = async (walletId: string): Promise<Wallet | undefined> => {
  return db('wallets').where({ id: walletId }).first();
};

const createTransaction = async (
  fromWalletId: string,
  toWalletId: string,
  amount: number,
  type: string
): Promise<void> => {
  await db("transactions").insert({
    id: uuidv4(),
    from_wallet_id: fromWalletId,
    to_wallet_id: toWalletId,
    amount,
    type,
  });
};

export { getWalletByUserId, getWalletById, incrementWalletBalance, decrementWalletBalance, createTransaction };
