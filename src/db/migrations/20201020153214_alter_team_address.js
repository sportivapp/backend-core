exports.up = (knex, Promise) => knex.schema.alterTable('eteam', t => {
    t.integer('eaddresseaddressid').references('eaddress.eaddressid').onDelete('CASCADE');
});

exports.down = (knex, Promise) => knex.schema.alterTable('eteam', t => {
    t.dropColumn('eaddresseaddressid')
});