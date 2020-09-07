exports.up = (knex, Promise) => knex.schema.createTable('erostershift', t => {
    t.increments('erostershiftid').primary().unsigned();
    t.time('erostershiftstartime').notNullable();
    t.time('erostershiftendtime').notNullable();
    t.integer('erostershiftcreateby').notNullable().defaultTo(0);
    t.bigInteger('erostershiftcreatetime').notNullable().defaultTo(Date.now());
    t.integer('erostershiftchangeby');
    t.bigInteger('erostershiftchangetime');
    t.integer('erostershiftdeleteby');
    t.boolean('erostershiftdeletestatus').defaultTo(false);
    t.bigInteger('erostershiftdeletetime');
    t.integer('erostererosterid').notNullable().references('eroster.erosterid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('erostershift');