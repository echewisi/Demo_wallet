import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      user: "root",
    //   password: "your-password",
      database: "demo_wallet_db"
    },
    migrations: {
      directory: './migrations'
    }
  }
};

export default config;
