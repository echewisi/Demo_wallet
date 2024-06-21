import knex from "knex";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail, User, getUserById } from "../models/userModel";
import config from "../knexfile";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { error } from "console";

dotenv.config();

const db = knex(config.development);

/**
 *
 * @param user: this stands as the present user entity engaging in action with the application. in this instance, a user is being created.
 * @returns: the created user is being returned if successful or the process is errored due to other failed conditions, including but not limited
 * to being present in adjutor's karma database.
 */
export const createUserService = async (user: User) => {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      throw new Error("User already exists.");
    }

    // Check if user is in blacklist
    console.log("Preparing to check if user is in blacklist");
    try{
      const apiUrl = await axios.get(
        `https://adjutor.lendsqr.com/v2/verification/karma/${user.email}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.ADJUTOR_SECRET_KEY}`,
          },
        }
      );
      //please note that after consistent tries with the api that it only seems to read one kind of identity, and
      //that identity stands as the identity provided in the documentation. every ohter means of identity: email, phone, and such does not work
  
      console.log("Making request to Adjutor API");
      console.log("URL:", apiUrl);
      console.log("Headers:", apiUrl.headers);
  
      console.log("Blacklist check response:", apiUrl.data);
      if (apiUrl.data.data.karma_identity) {
        throw new Error("User is in the blacklist. Cannot be onboarded!");
      }
    } catch(axiosError: any){
      if(axiosError.response && axiosError.response.status === 404){
        console.warn("Adjutor API returned 404. Skipping blacklist check.")
      } else{
        throw axiosError;
      }
    }



    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(user.password, 10);

  // Assign a new UUID to the user
  user.id = uuidv4();

  // Create a wallet for the new user
  const walletId = uuidv4();
  await db("wallets").insert({
    wallet_id: walletId,
    user_id: user.id,
    balance: 0.0,
  });

  // Create the user in the database
  const newUser = await createUser({ ...user, password: hashedPassword });

  // Update user with wallet_id
  await db("users").where({ id: newUser.id }).update({ wallet_id: walletId });

  // Fetch and return the created user with wallet_id
  const updatedUser = await getUserById(newUser.id!);

  return updatedUser!;
  } catch (error) {
    console.error(`Error creating user:${error}`);
    throw error;
  }
};
