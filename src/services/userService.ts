import knex from "knex";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail, User, getUserById } from "../models/userModel";
import config from "../knexfile";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { validateUserRegistration } from "../utils/validation";
import { 
  ValidationError, 
  ConflictError, 
  BlacklistError, 
  DatabaseError,
  ExternalServiceError 
} from "../utils/errors";

dotenv.config();

const db = knex(config['production']!);

/**
 *
 * @param user: this stands as the present user entity engaging in action with the application. in this instance, a user is being created.
 * @returns: the created user is being returned if successful or the process is errored due to other failed conditions, including but not limited
 * to being present in adjutor's karma database.
 */
export const createUserService = async (user: User): Promise<User> => {
  try {
    // Validate input data
    const validation = validateUserRegistration(user);
    if (!validation.isValid) {
      throw new ValidationError(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists.");
    }

    // Check if user is in blacklist using Adjutor Karma API
    await checkKarmaBlacklist(user.email);

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(user.password, 12);

    // Assign a new UUID to the user
    user.id = uuidv4();

    // Create the user in the database
    const newUser = await createUser({ ...user, password: hashedPassword });

    // Create a wallet for the new user
    const walletId = uuidv4();
    await db("wallets").insert({
      wallet_id: walletId,
      user_id: newUser.id,
      balance: 0.0,
    });

    // Update user with wallet_id
    await db("users").where({ id: newUser.id }).update({ wallet_id: walletId });

    // Fetch and return the created user with wallet_id
    const updatedUser = await getUserById(newUser.id!);
    if (!updatedUser) {
      throw new DatabaseError("Failed to retrieve created user");
    }

    // Remove password from response
    const { password, ...userResponse } = updatedUser;
    return userResponse as User;
  } catch (error) {
    if (error instanceof ValidationError || 
        error instanceof ConflictError || 
        error instanceof BlacklistError ||
        error instanceof DatabaseError) {
      throw error;
    }
    console.error(`Unexpected error creating user: ${error}`);
    throw new DatabaseError("Failed to create user");
  }
};

/**
 * Check if user is in Karma blacklist
 */
const checkKarmaBlacklist = async (email: string): Promise<void> => {
  try {
    console.log(`Checking Karma blacklist for email: ${email}`);
    
    const response = await axios.get(
      `https://adjutor.lendsqr.com/v2/verification/karma/${email}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env['ADJUTOR_SECRET_KEY']}`,
        },
        timeout: 10000, // 10 second timeout
      }
    );

    console.log("Karma blacklist check response:", response.data);
    
    // Check if user is in blacklist based on amount_in_contention
    const amountInContention = response.data?.data?.amount_in_contention;
    if (amountInContention && parseFloat(amountInContention) > 0) {
      throw new BlacklistError("User is in the Karma blacklist. Cannot be onboarded!");
    }
  } catch (axiosError: any) {
    if (axiosError.response?.status === 404) {
      console.warn("User not found in Karma blacklist (404). Proceeding with registration.");
      return; // User not in blacklist, proceed
    }
    
    if (axiosError instanceof BlacklistError) {
      throw axiosError; // Re-throw blacklist errors
    }
    
    console.error("Karma API error:", axiosError.message);
    throw new ExternalServiceError("Unable to verify user status with Karma service");
  }
};
