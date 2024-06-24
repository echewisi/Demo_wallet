import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.resolve(__dirname, "../.env") });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.LOCAL_DB_HOST,
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASSWORD,
      database: process.env.LOCAL_DB_NAME,
    },
    migrations: {
      directory: path.resolve(__dirname, "./migrations"),
    },
  },
  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: path.resolve(__dirname, "./migrations"),
    },
  },
};



export default config;
