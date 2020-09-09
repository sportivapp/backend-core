exports.up = (knex, Promise) => knex.schema.alterTable('epermitapprovalmapping', t => {
    t.string('epermitapprovalmappingstatus').notNullable().defaultTo('PENDING')
});

exports.down = (knex, Promise) => knex.schema.alterTable('epermitapprovalmapping', t => {
    t.dropColumn('epermitapprovalmappingstatus')
});