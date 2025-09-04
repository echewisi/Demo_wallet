import knex from 'knex';

// Test database configuration using SQLite in-memory database
export const testDbConfig = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  useNullAsDefault: true,
  migrations: {
    directory: './src/migrations'
  }
};

export const createTestDb = () => knex(testDbConfig);

