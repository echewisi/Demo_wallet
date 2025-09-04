import bcrypt from 'bcrypt';
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

// Mock dependencies
jest.mock('bcrypt');
jest.mock('../../../../src/models/userModel', () => ({
  getUserById: jest.fn(),
}));
jest.mock('../../../../src/models/walletModel', () => ({
  getWalletByUserId: jest.fn(),
  incrementWalletBalance: jest.fn(),
  decrementWalletBalance: jest.fn(),
  getWalletById: jest.fn(),
}));
jest.mock('knex', () => {
  return jest.fn(() => ({
    transaction: jest.fn((callback) => {
      const mockTrx = {
        insert: jest.fn().mockResolvedValue([123]),
        where: jest.fn().mockReturnThis(),
        decrement: jest.fn().mockResolvedValue(undefined),
        increment: jest.fn().mockResolvedValue(undefined),
      };
      return callback(mockTrx);
    }),
  }));
});

describe('Wallet Service', () => {
  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    password: 'hashed-password',
    wallet_id: '550e8400-e29b-41d4-a716-446655440001',
  };

  const mockWallet = {
    wallet_id: '550e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    balance: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fund account successfully', async () => {
    (getUserById as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
    (getWalletById as jest.Mock).mockResolvedValue({ ...mockWallet, balance: 150 });

    const result = await fundAccountService(mockUser.id, 50, 'password123');
    expect(result.success).toBe(true);
    expect(result.message).toBe('Account funded successfully!');
    expect(result.newBalance).toBe(150);
    expect(incrementWalletBalance).toHaveBeenCalledWith(mockWallet.wallet_id, 50);
  });

  it('should return an error if password is incorrect for funding account', async () => {
    (getUserById as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(fundAccountService(mockUser.id, 50, 'wrongpassword')).rejects.toThrow(
      'Invalid password'
    );
  });

  it('should transfer funds successfully', async () => {
    (getUserById as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
    (getWalletById as jest.Mock).mockResolvedValue({ wallet_id: '550e8400-e29b-41d4-a716-446655440002', user_id: 'user-456', balance: 100 });

    const result = await transferFundsService(mockUser.id, '550e8400-e29b-41d4-a716-446655440002', 50, 'password123');
    expect(result.success).toBe(true);
    expect(result.message).toBe('Transfer successful.');
    expect(result.transactionId).toBe('123');
  });

  it('should return an error if recipient wallet does not exist for transfer', async () => {
    (getUserById as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
    (getWalletById as jest.Mock).mockResolvedValue(null);

    await expect(transferFundsService(mockUser.id, 'nonexistent-wallet-id', 50, 'password123')).rejects.toThrow(
      'Recipient wallet not found'
    );
  });

  it('should withdraw funds successfully', async () => {
    (getUserById as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
    (getWalletById as jest.Mock).mockResolvedValue({ ...mockWallet, balance: 50 });

    const result = await withdrawFundsService(mockUser.id, 50, 'password123');
    expect(result.success).toBe(true);
    expect(result.message).toBe('Withdrawal successful.');
    expect(result.newBalance).toBe(50);
    expect(decrementWalletBalance).toHaveBeenCalledWith(mockWallet.wallet_id, 50);
  });

  it('should return an error if password is incorrect for withdrawal', async () => {
    (getUserById as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(withdrawFundsService(mockUser.id, 50, 'wrongpassword')).rejects.toThrow(
      'Invalid password'
    );
  });
});
