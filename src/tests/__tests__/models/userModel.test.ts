import { createUser, getUserByEmail, User } from '../../../../src/models/userModel';

// Mock the database operations
jest.mock('../../../../src/models/userModel', () => {
  const originalModule = jest.requireActual('../../../../src/models/userModel');
  return {
    ...originalModule,
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserById: jest.fn(),
  };
});

describe('User Model', () => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    password: 'password123',
    wallet_id: 'wallet123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create and retrieve a user by email', async () => {
    (createUser as jest.Mock).mockResolvedValue(mockUser);
    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    const result = await createUser(mockUser);
    expect(result).toEqual(mockUser);
    expect(createUser).toHaveBeenCalledWith(mockUser);

    const user = await getUserByEmail('john@example.com');
    expect(user).toEqual(mockUser);
    expect(getUserByEmail).toHaveBeenCalledWith('john@example.com');
  });

  it('should return null if user does not exist', async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue(null);

    const user = await getUserByEmail('nonexistent@example.com');
    expect(user).toBeNull();
    expect(getUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
  });

  it('should handle errors when creating a user with existing email', async () => {
    (createUser as jest.Mock).mockRejectedValue(
      new Error("Error creating user: Duplicate entry 'john@example.com' for key 'users.email'")
    );

    await expect(createUser(mockUser)).rejects.toThrow(
      "Error creating user: Duplicate entry 'john@example.com' for key 'users.email'"
    );
  });
});
