exports.up = (knex, Promise) => knex.schema.alterTable('epermitapprovalmapping', t => {
    t.string('epermitapprovalmappingstatus').notNullable().defaultTo('PENDING').alter()
});

exports.down = (knex, Promise) => knex.schema.alterTable('epermitapprovalmapping', t => {
    t.dropColumn('epermitapprovalmappingstatus')
});