exports.up = (knex, Promise) => knex.schema.createTable('erosterusermapping', t => {
    t.integer('erostererosterid').notNullable().references('eroster.erosterid').onDelete('CASCADE');
    t.integer('eusereuserid').notNullable().references('euser.euserid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('erosterusermapping');