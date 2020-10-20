exports.up = (knex, Promise) => knex.schema.alterTable('eaddress', t => {
    t.dropColumn('eaddresspostalcode')
});

exports.down = (knex, Promise) => knex.schema.alterTable('eaddress', t => {
    
});