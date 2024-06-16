import knex from "knex";
import config from "../../knexfile";
import { v4 as uuidv4 } from "uuid";

const db = knex(config.development);

interface Wallet {
  id: string;
  user_id: string;
  balance: number;
}

const getWalletByUserId = async (userId: string): Promise<Wallet | undefined> => {
  return db<Wallet>("wallets").where({ user_id: userId }).first();
};

const updateWalletBalance = async (userId: string, amount: number): Promise<void> => {
  await db("wallets").where({ user_id: userId }).increment("balance", amount);
};

const createTransaction = async (fromWalletId: string, toWalletId: string, amount: number, type: string): Promise<void> => {
  await db("transactions").insert({
    id: uuidv4(),
    from_wallet_id: fromWalletId,
    to_wallet_id: toWalletId,
    amount,
    type,
  });
};


export { getWalletByUserId, updateWalletBalance, createTransaction };
