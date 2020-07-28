exports.up = (knex, Promise) => knex.schema.createTable('erostershift', t => {
    t.increments('erostershiftid').primary().unsigned();
    t.time('erostershiftstartime').notNullable();
    t.time('erostershiftendtime').notNullable();
    t.integer('erostererosterid').notNullable().references('eroster.erosterid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('erostershift');