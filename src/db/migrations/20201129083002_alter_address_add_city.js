exports.up = (knex, Promise) => knex.schema.alterTable('eaddress', t => {
    t.integer('ecityecityid').references('ecity.ecityid');
    t.integer('estateestateid').nullable().alter();
});

exports.down = (knex, Promise) => knex.schema.alterTable('eaddress', t => {
    t.dropColumn('ecityecityid');
});