exports.up = (knex, Promise) => knex.schema.alterTable('ethread', t => {
    t.integer('efileefileid').references('efile.efileid').onDelete('CASCADE');
});

exports.down = (knex, Promise) => knex.schema.alterTable('ethread', t => {
    t.dropForeign('efileefileid', 'efileefileid_ethread_foreign')
    t.dropColumn('efileefileid')
});