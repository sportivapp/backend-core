exports.up = (knex, Promise) => knex.schema.alterTable('epermitapprovalmapping', t => {
    t.dropColumn('epermitapprovalmappingstatus')
});

exports.down = (knex, Promise) => knex.schema.alterTable('epermitapprovalmapping', t => {
    t.integer('epermitapprovalmappingstatus').notNullable().defaultTo(1)
});