exports.up = (knex, Promise) => knex.schema.alterTable('ethread', t => {
    t.integer('efileefileid').references('efile.efileid').onDelete('CASCADE');
});

exports.down = (knex, Promise) => knex.schema.alterTable('ethread', t => {
    t.dropForeign('efileefileid', 'ethread_efileefileid_foreign')
    t.dropColumn('efileefileid')
});