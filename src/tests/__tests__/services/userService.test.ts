import { createUserService } from '../../../services/userService';
import { User } from '../../../models/userModel';
import bcrypt from 'bcrypt';
import knex from 'knex';
import config from '../../../knexfile';

const db = knex(config.development);

jest.mock('axios');
import axios from 'axios';

describe('User Service', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

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
});
