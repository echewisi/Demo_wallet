import knex from 'knex';
import bcrypt from 'bcrypt';
import config from '../../../../src/knexfile';
import { User } from '../../../../src/models/userModel';
import {
  fundAccountService,
  transferFundsService,
  withdrawFundsService,
} from '../../../../src/services/walletService';
import { getUserById } from '../../../../src/models/userModel';
import {
  getWalletByUserId,
  incrementWalletBalance,
  decrementWalletBalance,
  getWalletById,
} from '../../../../src/models/walletModel';

const db = knex(config.development);

jest.mock('bcrypt');
jest.mock('../../../../src/models/userModel');
jest.mock('../../../../src/models/walletModel');

describe('Wallet Service', () => {
    const mockUser: User = {
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
  
    afterEach(async () => {
      jest.clearAllMocks();
      await db('wallets').del();
      await db('users').del();
    });
  
    afterAll(async () => {
      await db.destroy();
    });
  
    it('should fund account successfully', async () => {
      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
  
      const result = await fundAccountService(mockUser.id!, 50, 'password123');
      expect(result).toEqual({ success: true, message: 'Account funded successfully!' });
      expect(incrementWalletBalance).toHaveBeenCalledWith(mockWallet.id, 50);
    });
  
    it('should transfer funds successfully', async () => {
      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
      (getWalletById as jest.Mock).mockResolvedValue({ id: 'wallet-456', user_id: 'user-456', balance: 100 });
  
      const result = await transferFundsService(mockUser.id!, 'wallet-456', 50, 'password123');
      expect(result).toEqual({ success: true, message: 'Transfer successful.' });
      expect(decrementWalletBalance).toHaveBeenCalledWith(mockWallet.id, 50);
      expect(incrementWalletBalance).toHaveBeenCalledWith('wallet-456', 50);
    });
  
    it('should withdraw funds successfully', async () => {
      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
  
      const result = await withdrawFundsService(mockUser.id!, 50, 'password123');
      expect(result).toEqual({ success: true, message: 'Withdrawal successful.' });
      expect(decrementWalletBalance).toHaveBeenCalledWith(mockWallet.id, 50);
    });
  });