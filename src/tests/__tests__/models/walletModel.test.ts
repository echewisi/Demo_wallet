import {
  getWalletById,
  getWalletByUserId,
  incrementWalletBalance,
  decrementWalletBalance,
  createTransaction
} from '../../../../src/models/walletModel';

// Mock the database operations
jest.mock('../../../../src/models/walletModel', () => {
  const originalModule = jest.requireActual('../../../../src/models/walletModel');
  return {
    ...originalModule,
    getWalletById: jest.fn(),
    getWalletByUserId: jest.fn(),
    incrementWalletBalance: jest.fn(),
    decrementWalletBalance: jest.fn(),
    createTransaction: jest.fn(),
  };
});

describe('Wallet Model', () => {
  const mockWallet = {
    wallet_id: 'wallet-123',
    user_id: 'user-123',
    balance: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get wallet by user ID', async () => {
    (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);

    const wallet = await getWalletByUserId('user-123');
    expect(wallet).toEqual(mockWallet);
    expect(getWalletByUserId).toHaveBeenCalledWith('user-123');
  });

  it('should return null if wallet for user ID does not exist', async () => {
    (getWalletByUserId as jest.Mock).mockResolvedValue(null);

    const wallet = await getWalletByUserId('nonexistent-user-id');
    expect(wallet).toBeNull();
    expect(getWalletByUserId).toHaveBeenCalledWith('nonexistent-user-id');
  });

  it('should get wallet by wallet ID', async () => {
    (getWalletById as jest.Mock).mockResolvedValue(mockWallet);

    const wallet = await getWalletById('wallet-123');
    expect(wallet).toEqual(mockWallet);
    expect(getWalletById).toHaveBeenCalledWith('wallet-123');
  });

  it('should increment wallet balance', async () => {
    (incrementWalletBalance as jest.Mock).mockResolvedValue(undefined);
    (getWalletById as jest.Mock).mockResolvedValue({ ...mockWallet, balance: 150 });

    await incrementWalletBalance('wallet-123', 50);
    expect(incrementWalletBalance).toHaveBeenCalledWith('wallet-123', 50);

    const updatedWallet = await getWalletById('wallet-123');
    expect(updatedWallet?.balance).toBe(150);
  });

  it('should decrement wallet balance', async () => {
    (decrementWalletBalance as jest.Mock).mockResolvedValue(undefined);
    (getWalletById as jest.Mock).mockResolvedValue({ ...mockWallet, balance: 50 });

    await decrementWalletBalance('wallet-123', 50);
    expect(decrementWalletBalance).toHaveBeenCalledWith('wallet-123', 50);

    const updatedWallet = await getWalletById('wallet-123');
    expect(updatedWallet?.balance).toBe(50);
  });

  it('should create a transaction', async () => {
    (createTransaction as jest.Mock).mockResolvedValue(undefined);

    await createTransaction('wallet-123', 'wallet-456', 50, 'transfer');
    expect(createTransaction).toHaveBeenCalledWith('wallet-123', 'wallet-456', 50, 'transfer');
  });

  it('should handle errors when creating a transaction with invalid data', async () => {
    (createTransaction as jest.Mock).mockRejectedValue(
      new Error("Error creating transaction: Invalid recipient wallet ID")
    );

    await expect(createTransaction('wallet-123', '', 50, 'transfer')).rejects.toThrow(
      "Error creating transaction: Invalid recipient wallet ID"
    );
  });
});
