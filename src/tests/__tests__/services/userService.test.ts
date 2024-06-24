import { createUserService } from '../../../services/userService';
import { User } from '../../../models/userModel';
import bcrypt from 'bcrypt';
import knex from 'knex';
import config from '../../../knexfile';

const db = knex(config.production);

jest.mock('axios');
import axios from 'axios';

describe('User Service', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  }, 10000); 
  

  afterEach(async () => {
    await db('users').del();
    await db('wallets').del();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should create a new user and wallet', async () => {
    const mockUser: User = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'password123',
    };

    (axios.get as jest.Mock).mockResolvedValue({ data: { data: { karma_identity: null } } });

    const newUser = await createUserService(mockUser);
    expect(newUser).toHaveProperty('id');
    expect(newUser).toHaveProperty('wallet_id');
  });

  it('should not create a user if they are blacklisted', async () => {
    const mockUser: User = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '0987654321',
      password: 'password123',
    };

    (axios.get as jest.Mock).mockResolvedValue({ data: { data: { karma_identity: true } } });

    await expect(createUserService(mockUser)).rejects.toThrow('User is in the blacklist. Cannot be onboarded!');
  });

  it('should hash the user password before saving', async () => {
    const mockUser: User = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'password123',
    };

    (axios.get as jest.Mock).mockResolvedValue({ data: { data: { karma_identity: null } } });

    // Explicitly cast bcrypt.hash to its expected type
    const bcryptHashSpy = jest.spyOn(bcrypt as unknown as { hash: (data: string, saltOrRounds: number) => Promise<string> }, 'hash').mockResolvedValue('hashed-password');

    const newUser = await createUserService(mockUser);
    expect(bcryptHashSpy).toHaveBeenCalledWith('password123', expect.any(Number));
    expect(newUser.password).toBe('hashed-password');
  });

  it('should throw an error if email already exists', async () => {
    const mockUser: User = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'password123',
    };

    await db('users').insert(mockUser);

    await expect(createUserService(mockUser)).rejects.toThrow('User already exists.');
  });
});
