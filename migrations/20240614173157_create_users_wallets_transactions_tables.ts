import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("phone").notNullable().unique();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("wallets", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.decimal("balance", 14, 2).defaultTo(0.0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.uuid("from_wallet_id").references("id").inTable("wallets").onDelete("CASCADE");
    table.uuid("to_wallet_id").references("id").inTable("wallets").onDelete("CASCADE");
    table.decimal("amount", 14, 2).notNullable();
    table.string("type").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
  await knex.schema.dropTableIfExists("wallets");
  await knex.schema.dropTableIfExists("users");
}
