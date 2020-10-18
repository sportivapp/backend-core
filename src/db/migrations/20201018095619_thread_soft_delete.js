exports.up = (knex, Promise) => knex.schema.alterTable('ethread', t => {
    t.boolean('ethreaddeletestatus').defaultTo(false);
    t.bigInteger('ethreaddeletetime');
    t.integer('ethreaddeleteby');
});

exports.down = (knex, Promise) => knex.schema.alterTable('ethread', t => {
    t.dropColumn('ethreaddeletestatus');
    t.dropColumn('ethreaddeletetime');
    t.dropColumn('ethreaddeleteby');
});