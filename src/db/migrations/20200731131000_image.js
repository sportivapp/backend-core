exports.up = (knex, Promise) => knex.schema.createTable('eimage', t => {
    t.increments('eimageid').primary().unsigned();
    t.binary('eimagefile').notNullable();
    t.integer('eimagetype');
    t.integer('eimagecreateby').notNullable();
    t.timestamp('eimagecreatetime', false).notNullable().defaultTo(knex.fn.now());
    t.integer('eimagechangeby');
    t.timestamp('eimagechangetime', false);
    t.integer('eimagetablestatus').notNullable().defaultTo(1);
    t.integer('eusereuserid').notNullable().references('euser.euserid');
    // t.integer('etodolisttasketodolisttaskid').notNullable().references('etodolisttask.etodolisttaskid');
    // t.integer('epermitepermitid').notNullable().references('epermit.epermitid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eimage');