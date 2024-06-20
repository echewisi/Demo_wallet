import knex from 'knex';
import config from '../../../../src/knexfile';
import {
  getWalletById,
  getWalletByUserId,
  incrementWalletBalance,
  decrementWalletBalance,
  createTransaction
} from '../../../../src/models/walletModel';

const db = knex(config.development);

describe('Wallet Model', () => {
    const mockUser = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'hashed-password',
      wallet_id: 'wallet-123',
    };
  
    const mockWallet = {
      id: 'wallet-123',
      user_id: 'user-123',
      balance: 100,
    };
  
    beforeAll(async () => {
      await db.migrate.latest();
    });
  
    beforeEach(async () => {
      await db('users').insert(mockUser);
      await db('wallets').insert(mockWallet);
    });
  
    afterEach(async () => {
      await db('wallets').del();
      await db('users').del();
    });
  
    afterAll(async () => {
      await db.destroy();
    });
  
    it('should get wallet by user ID', async () => {
      const wallet = await getWalletByUserId(mockUser.id!);
      expect(wallet).toBeDefined();
      expect(wallet?.user_id).toBe(mockUser.id);
    });
  
    it('should get wallet by wallet ID', async () => {
      const wallet = await getWalletById(mockWallet.id);
      expect(wallet).toBeDefined();
      expect(wallet?.id).toBe(mockWallet.id);
    });
  
    it('should increment wallet balance', async () => {
      await incrementWalletBalance(mockWallet.id, 50);
      const updatedWallet = await getWalletById(mockWallet.id);
      expect(updatedWallet).toBeDefined();
      expect(updatedWallet?.balance).toBe(mockWallet.balance + 50);
    });
  
    it('should decrement wallet balance', async () => {
      await decrementWalletBalance(mockWallet.id, 50);
      const updatedWallet = await getWalletById(mockWallet.id);
      expect(updatedWallet).toBeDefined();
      expect(updatedWallet?.balance).toBe(mockWallet.balance - 50);
    });
  
    it('should create a transaction', async () => {
      const newTransactionId = 'transaction-123';
      await createTransaction(mockWallet.id, 'wallet-456', 50, 'transfer');
      const transactions = await db('transactions').where({ from_wallet_id: mockWallet.id });
      expect(transactions.length).toBe(1);
      expect(transactions[0]).toHaveProperty('id');
      expect(transactions[0].from_wallet_id).toBe(mockWallet.id);
      expect(transactions[0].to_wallet_id).toBe('wallet-456');
      expect(transactions[0].amount).toBe(50);
      expect(transactions[0].type).toBe('transfer');
    });
  });