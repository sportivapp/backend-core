exports.up = (knex, Promise) => knex.schema.alterTable('epermitapprovalmapping', t => {
    t.string('epermitapprovalmappingstatus').defaultTo('PENDING').alter()
});

exports.down = (knex, Promise) => knex.schema.alterTable('epermitapprovalmapping', t => {
    t.integer('epermitapprovalmappingstatus').notNullable().defaultTo(1).alter()
});