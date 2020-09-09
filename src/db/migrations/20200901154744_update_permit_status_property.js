exports.up = (knex, Promise) => knex.schema.alterTable('epermit', t => {
    t.string('epermitstatus').defaultTo('CREATED').alter()
});

exports.down = (knex, Promise) => knex.schema.alterTable('epermit', t => {
    t.integer('epermitstatus').notNullable().defaultTo(0).alter()
});