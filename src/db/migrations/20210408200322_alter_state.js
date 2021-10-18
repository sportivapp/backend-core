exports.up = (knex, Promise) => knex.schema.alterTable('estate', t => {
    t.string('estatetimezone');
});

exports.down = (knex, Promise) => knex.schema.alterTable('estate', t => {
    t.dropColumn('estatetimezone');
});