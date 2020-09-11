exports.up = (knex, Promise) => knex.schema.alterTable('efile', t => {
    t.integer('efilesize').notNullable();
});

exports.down = (knex, Promise) => knex.schema.alterTable('efile', t => {
    t.dropColumn('efilesize')
});