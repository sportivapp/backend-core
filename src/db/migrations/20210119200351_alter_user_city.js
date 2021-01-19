exports.up = (knex, Promise) => knex.schema.alterTable('euser', t => {
    t.integer('ecityecityid').references('ecity.ecityid').onDelete('SET NULL');
});

exports.down = (knex, Promise) => knex.schema.alterTable('euser', t => {
    t.dropColumn('ecityecityid');
});