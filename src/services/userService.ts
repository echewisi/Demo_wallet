import knex from "knex";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail, User } from "../models/userModel";
import config from "../../knexfile";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const db = knex(config.development);

/**
 * 
 * @param user: this stands as the present user entity engaging in action with the application. in this instance, a user is being created.
 * @returns: the created user is being returned if successful or the process is errored due to other failed conditions, including but not limited
 * to being present in adjutor's karma database. 
 */
export const createUserService = async (user: User) => {
  // Check if user is in blacklist
  const response = await axios.get(`https://adjutor.lendsqr.com/v2/verification/karma/${user.email}`);
  if (response.data.data.karma_identity) {
    throw new Error("User is in the blacklist. Cannot be onboarded!");
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

