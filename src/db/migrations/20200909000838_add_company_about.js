exports.up = (knex, Promise) => knex.schema.alterTable('ecompany', t => {
    t.string('ecompanyabout')
});

exports.down = (knex, Promise) => knex.schema.alterTable('ecompany', t => {
    t.dropColumn('ecompanyabout')
});