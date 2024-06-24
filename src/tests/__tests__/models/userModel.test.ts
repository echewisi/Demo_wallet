import { createUser, getUserByEmail, User } from '../../../../src/models/userModel';
import knex from 'knex';
import config from '../../../../src/knexfile';

const db = knex(config.production);

describe('User Model', () => {
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

  it('should return null if user does not exist', async () => {
    const user = await getUserByEmail('nonexistent@example.com');
    expect(user).toBeNull();
  });

  it('should handle errors when creating a user with existing email', async () => {
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'password123',
      wallet_id: 'wallet123',
    };

    await createUser(mockUser);

    await expect(createUser(mockUser)).rejects.toThrow(
      "Error creating user: Duplicate entry 'john@example.com' for key 'users.email'"
    );
  });
});
