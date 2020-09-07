exports.up = (knex, Promise) => knex.schema.createTable('eimage', t => {
    t.increments('eimageid').primary().unsigned();
    t.binary('eimagefile').notNullable();
    t.integer('eimagetype');
    t.integer('eimagecreateby').notNullable();
    t.bigInteger('eimagecreatetime').notNullable().defaultTo(Date.now());
    t.integer('eimagechangeby');
    t.bigInteger('eimagechangetime');
    t.integer('eimagedeleteby');
    t.boolean('eimagedeletestatus').defaultTo(false);
    t.bigInteger('eimagedeletetime');
    t.integer('eimagetablestatus').notNullable().defaultTo(1);
    t.integer('eusereuserid').notNullable().references('euser.euserid');
    // t.integer('etodolisttasketodolisttaskid').notNullable().references('etodolisttask.etodolisttaskid');
    // t.integer('epermitepermitid').notNullable().references('epermit.epermitid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eimage');