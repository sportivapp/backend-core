exports.up = (knex, Promise) => knex.schema.alterTable('ereportthread', t => {
    t.integer('ereportthreadtypeereportthreadtypeid').references('ereportthreadtype.ereportthreadtypeid').onDelete('CASCADE')
});

exports.down = (knex, Promise) => knex.schema.alterTable('ereportthread', t => {
    t.dropForeign('ereportthreadtypeereportthreadtypeid');
    t.dropColumn('ereportthreadtypeereportthreadtypeid');
});