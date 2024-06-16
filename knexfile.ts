import type { Knex } from "knex";
import dotenv from 'dotenv'; 

dotenv.config()

const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER ,
      database: process.env.DB_NAME 
    },
    migrations: {
      directory: './migrations'
    }
  }
};

export default config;
