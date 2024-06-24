import type { Knex } from "knex";
import dotenv from 'dotenv'; 
import path from 'path';

console.log('__dirname:', __dirname); 

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || 'your localhost',
      user: process.env.DB_USER || 'your user name',
      password: process.env.DB_PASSWORD || 'your password',
      database: process.env.DB_NAME || 'your database name' 
    },
    migrations: {
      directory: path.resolve(__dirname, './migrations')
    }
  }, 
  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME 
    },
    migrations: {
      directory: path.resolve(__dirname, './migrations')
    }
  }
};

export default config;
