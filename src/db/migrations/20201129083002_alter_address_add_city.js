exports.up = (knex, Promise) => knex.schema.alterTable('eaddress', t => {
    t.integer('ecityecityid').references('ecity.ecityid');
});

exports.down = (knex, Promise) => knex.schema.alterTable('eaddress', t => {
    t.dropColumn('ecityecityid');
});