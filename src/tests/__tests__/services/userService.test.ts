// Mock dependencies first
jest.mock('axios');
jest.mock('bcrypt');
jest.mock('../../../models/userModel', () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
  getUserById: jest.fn(),
}));

// Mock the entire userService module
jest.mock('../../../services/userService', () => {
  const originalModule = jest.requireActual('../../../services/userService');
  return {
    ...originalModule,
    createUserService: jest.fn(),
  };
});

import { createUserService } from '../../../services/userService';
import { User } from '../../../models/userModel';

describe('User Service', () => {
  const mockUser: User = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    password: 'SecurePass123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user and wallet', async () => {
    const mockCreatedUser = {
      ...mockUser,
      id: 'user-123',
      wallet_id: 'wallet-123',
      password: 'hashed-password'
    };

    (createUserService as jest.Mock).mockResolvedValue(mockCreatedUser);

    const newUser = await createUserService(mockUser);
    expect(newUser).toHaveProperty('id');
    expect(newUser).toHaveProperty('wallet_id');
    expect(createUserService).toHaveBeenCalledWith(mockUser);
  });

  it('should not create a user if they are blacklisted', async () => {
    (createUserService as jest.Mock).mockRejectedValue(
      new Error('User is in the Karma blacklist. Cannot be onboarded!')
    );

    await expect(createUserService(mockUser)).rejects.toThrow('User is in the Karma blacklist. Cannot be onboarded!');
  });

  it('should hash the user password before saving', async () => {
    const mockCreatedUser = {
      ...mockUser,
      id: 'user-123',
      wallet_id: 'wallet-123',
      password: 'hashed-password'
    };

    (createUserService as jest.Mock).mockResolvedValue(mockCreatedUser);

    const newUser = await createUserService(mockUser);
    expect(newUser.password).toBe('hashed-password');
    expect(createUserService).toHaveBeenCalledWith(mockUser);
  });

  it('should throw an error if email already exists', async () => {
    (createUserService as jest.Mock).mockRejectedValue(
      new Error('User with this email already exists.')
    );

    await expect(createUserService(mockUser)).rejects.toThrow('User with this email already exists.');
  });
});
