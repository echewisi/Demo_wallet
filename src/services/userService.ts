import knex from "knex";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail, User } from "../models/userModel";
import config from "../../knexfile";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const db = knex(config.development);

export const createUserService = async (user: User) => {
  // Check if user is in blacklist
  const response = await axios.get(`https://adjutor.lendsqr.com/v2/verification/karma/${user.email}`);
  if (response.data.data.karma_identity) {
    throw new Error("User is in the blacklist.");
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // Assign a new UUID to the user
  user.id = uuidv4();
  const newUser = await createUser({ ...user, password: hashedPassword });

  // Create a wallet for the new user
  await db("wallets").insert({ id: uuidv4(), user_id: newUser.id, balance: 0.0 });

  return newUser;
};

export const loginService = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
