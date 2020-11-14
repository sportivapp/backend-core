exports.up = (knex, Promise) => knex.schema.alterTable('enews', t => {
    t.bigInteger('enewsscheduledate').nullable()
    t.boolean('enewsisscheduled').defaultTo(false);
});

exports.down = (knex, Promise) => knex.schema.alterTable('enews', t => {
    t.dropColumn('enewsscheduledate')
    t.dropColumn('enewsisscheduled')
});