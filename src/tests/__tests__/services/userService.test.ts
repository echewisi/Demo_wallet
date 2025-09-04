import { createUserService } from '../../../services/userService';
import { User } from '../../../models/userModel';
import bcrypt from 'bcrypt';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
jest.mock('bcrypt');
jest.mock('../../../models/userModel', () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
  getUserById: jest.fn(),
}));
jest.mock('knex', () => {
  return jest.fn(() => ({
    insert: jest.fn().mockResolvedValue(undefined),
    where: jest.fn().mockReturnThis(),
    update: jest.fn().mockResolvedValue(undefined),
  }));
});

import { getUserByEmail, createUser, getUserById } from '../../../models/userModel';

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
    (getUserByEmail as jest.Mock).mockResolvedValue(null);
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: { karma_identity: null } } });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (createUser as jest.Mock).mockResolvedValue({ ...mockUser, id: 'user-123', password: 'hashed-password' });
    (getUserById as jest.Mock).mockResolvedValue({ 
      ...mockUser, 
      id: 'user-123', 
      wallet_id: 'wallet-123',
      password: 'hashed-password'
    });

    const newUser = await createUserService(mockUser);
    expect(newUser).toHaveProperty('id');
    expect(newUser).toHaveProperty('wallet_id');
    expect(getUserByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(axios.get).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 12);
  });

  it('should not create a user if they are blacklisted', async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue(null);
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: { karma_identity: true } } });

    await expect(createUserService(mockUser)).rejects.toThrow('User is in the Karma blacklist. Cannot be onboarded!');
  });

  it('should hash the user password before saving', async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue(null);
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: { karma_identity: null } } });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (createUser as jest.Mock).mockResolvedValue({ ...mockUser, id: 'user-123', password: 'hashed-password' });
    (getUserById as jest.Mock).mockResolvedValue({ 
      ...mockUser, 
      id: 'user-123', 
      wallet_id: 'wallet-123',
      password: 'hashed-password'
    });

    const newUser = await createUserService(mockUser);
    expect(bcrypt.hash).toHaveBeenCalledWith('SecurePass123', 12);
    expect(newUser.password).toBe('hashed-password');
  });

  it('should throw an error if email already exists', async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    await expect(createUserService(mockUser)).rejects.toThrow('User with this email already exists.');
  });
});
