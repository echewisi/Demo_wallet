import { createUser, getUserByEmail, User } from '../../../../src/models/userModel';
import knex from 'knex';
import config from '../../../../src/knexfile';

const db = knex(config.development);

describe('User Model', () => {
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

  it('should create and retrieve a user by email', async () => {
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'password123',
      wallet_id: 'wallet123',
    };

    await createUser(mockUser);
    const user = await getUserByEmail('john@example.com');
    expect(user).toBeDefined();
    expect(user?.email).toBe('john@example.com');
  });
});
