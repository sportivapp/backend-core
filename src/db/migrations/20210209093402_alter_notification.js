exports.up = (knex, Promise) => knex.schema.alterTable('enotification', t => {
    t.boolean('enotificationisclicked').defaultTo(false);
});

exports.down = (knex, Promise) => knex.schema.alterTable('enotification', t => {
    t.dropColumn('enotificationisclicked');
});