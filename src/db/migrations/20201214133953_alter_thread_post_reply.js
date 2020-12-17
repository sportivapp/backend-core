exports.up = (knex, Promise) => knex.schema.alterTable('ethreadpostreply', t => {
    t.integer('ethreadethreadid').nullable().alter();
});

exports.down = (knex, Promise) => knex.schema.alterTable('ethreadpostreply', t => {
});