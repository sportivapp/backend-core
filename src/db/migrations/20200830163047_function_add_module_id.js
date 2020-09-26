exports.up = (knex, Promise) => knex.schema.alterTable('efunction', t => {
    t.integer('emoduleemoduleid').references('emodule.emoduleid').onDelete('CASCADE');
});

exports.down = (knex, Promise) => knex.schema.alterTable('efunction', t => {
    t.dropColumn('emoduleemoduleid')
});