exports.up = (knex, Promise) => knex.schema.createTable('erosterusermapping', t => {
    t.integer('erostererosterid').notNullable().references('eroster.erosterid').onDelete('CASCADE');
    t.integer('eusereuserid').references('euser.euserid');
    t.string('erosterusermappingname').notNullable()
    t.string('erosterusermappingjobdescription')
    t.string('erosterusermappingtype').notNullable().defaultTo(0)
    t.integer('erosterusermappingcreateby').notNullable().defaultTo(0);
    t.bigInteger('erosterusermappingcreatetime').notNullable();
    t.integer('erosterusermappingchangeby');
    t.bigInteger('erosterusermappingchangetime');
    t.integer('erosterusermappingdeleteby');
    t.boolean('erosterusermappingdeletestatus').defaultTo(false);
    t.bigInteger('erosterusermappingdeletetime');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('erosterusermapping');