exports.up = (knex, Promise) => knex.schema.createTable('enewslike', t => {
    t.increments('enewslikeid').primary().unsigned();
    t.integer('enewsenewsid').notNullable().references('enews.enewsid').onDelete('CASCADE');
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('SET NULL');
    t.integer('enewslikecreateby').notNullable();
    t.bigInteger('enewslikecreatetime').notNullable().defaultTo(Date.now());
    t.integer('enewslikechangeby');
    t.bigInteger('enewslikechangetime');

});

exports.down = (knex, Promise) => knex.schema.dropTable('enewslike');