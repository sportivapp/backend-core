exports.up = (knex, Promise) => knex.schema.createTable('eroster', t => {
    t.increments('erosterid').primary().unsigned();
    t.string('erostername', 256).notNullable();
    t.string('erosterdescription', 256);
    t.boolean('erosterisactive').notNullable().defaultTo(true);
    t.bigInteger('erostercreatetime').notNullable().defaultTo(Date.now());
    t.integer('erostercreateby').notNullable().defaultTo(0);
    t.bigInteger('erosterchangetime');
    t.integer('erosterchangeby');
    t.integer('erosterdeleteby');
    t.boolean('erosterdeletestatus').defaultTo(false);
    t.bigInteger('erosterdeletetime');
    t.integer('erostertablestatus').notNullable().defaultTo(1);
    t.integer('eprojecteprojectid').references('eproject.eprojectid').onDelete('CASCADE');
    t.integer('erostersupervisoruserid').references('euser.euserid');
    t.integer('erosterheaduserid').references('euser.euserid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eroster');