import knex from "knex";
import config from "../../knexfile";

const db = knex(config.development);

interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

/**
 * 
 * this file exists as a support service for the user service
 * when expanded upon 
 */

const getUserById = async (id: string): Promise<User | undefined> => {
  return db<User>("users").where({ id }).first();
};

const getUserByEmail = async (email: string): Promise<User | undefined> => {
  return db<User>("users").where({ email }).first();
};

const createUser = async (user: User): Promise<User> => {
  const [newUser] = await db<User>("users").insert(user).returning("*");
  return newUser;
};

const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
  await db<User>("users").where({ id }).update(user);
};

const deleteUser = async (id: string): Promise<void> => {
  await db<User>("users").where({ id }).del();
};

export { User, getUserById, getUserByEmail, createUser, updateUser, deleteUser };
