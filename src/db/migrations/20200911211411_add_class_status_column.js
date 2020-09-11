exports.up = (knex, Promise) => knex.schema.alterTable('eclass', t => {
    t.enum('eclassstatus', ['PENDING', 'ONGOING', 'FINISHED']).notNullable().defaultTo('PENDING');
});

exports.down = (knex, Promise) => knex.schema.alterTable('eclass', t => {
    t.dropColumn('eclassstatus')
});