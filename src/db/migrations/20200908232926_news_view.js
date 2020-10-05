exports.up = (knex, Promise) => knex.schema.createTable('enewsview', t => {
    t.increments('enewsviewid').primary().unsigned();
    t.integer('enewsenewsid').notNullable().references('enews.enewsid').onDelete('CASCADE');
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('SET NULL');
    t.integer('enewsviewcreateby').notNullable();
    t.bigInteger('enewsviewcreatetime').notNullable().defaultTo(Date.now());
    t.integer('enewsviewchangeby');
    t.bigInteger('enewsviewchangetime');

});

exports.down = (knex, Promise) => knex.schema.dropTable('enewsview');