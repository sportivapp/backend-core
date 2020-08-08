exports.up = (knex, Promise) => knex.schema.createTable('erosterusermapping', t => {
    t.integer('erostererosterid').notNullable().references('eroster.erosterid').onDelete('CASCADE');
    t.integer('eusereuserid').notNullable().references('euser.euserid');
    t.integer('erosterusermappingcreateby').notNullable().defaultTo(0);
    t.bigInteger('erosterusermappingcreatetime').notNullable().defaultTo(Date.now());
    t.integer('erosterusermappingchangeby');
    t.bigInteger('erosterusermappingchangetime');
    t.integer('erosterusermappingdeleteby');
    t.boolean('erosterusermappingdeletestatus').defaultTo(false);
    t.bigInteger('erosterusermappingdeletetime');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('erosterusermapping');