exports.up = (knex, Promise) => knex.schema.alterTable('efunction', t => {
    t.integer('emoduleemoduleid').references('emodule.emoduleid').onDelete('CASCADE');
});

exports.down = (knex, Promise) => knex.schema.alterTable('efunction', t => {
    t.dropForeign('emoduleemoduleid', 'efunction_emoduleemoduleid_foreign')
        .then(ignored => t.dropColumn('emoduleemoduleid'))
});