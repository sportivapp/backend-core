exports.up = (knex, Promise) => knex.schema.alterTable('ebanner', t => {
    t.enum('ebannertype', ['HOME', 'TOURNAMENT']).defaultTo('HOME');
});

exports.down = (knex, Promise) => knex.schema.alterTable('ebanner', t => {
    t.dropColumn('ebannertype');
});