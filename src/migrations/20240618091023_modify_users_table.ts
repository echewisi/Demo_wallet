import { Knex } from "knex";
/**
 * 
 *  migration file exists to rename 'id' field to 'wallet_id'
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("wallets", (table) => {
    table.renameColumn("id", "wallet_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("wallets", (table) => {
    table.renameColumn("wallet_id", "id");
  });
}
