exports.up = (knex, Promise) => knex.schema.createTable('eabsen', t => {
    t.increments('eabsenid').primary().unsigned();
    t.string('eabsenlocationdistanceaccuracy', 256);
    t.string('eabsenstatus', 256);
    t.string('eabsendescription', 256);
    t.timestamp('eabsentime', false).notNullable();
    t.integer('eabsensyncstatus');
    t.integer('eabsencreateby').notNullable();
    t.timestamp('eabsencreatetime', false).notNullable().defaultTo(knex.fn.now());
    t.integer('eabseneditby');
    t.timestamp('eabsenedittime', false);
    t.integer('eabsendeleteby');
    t.timestamp('eabsendeletetime', false);
    t.integer('eabsendeletestatus').defaultTo(0);
    t.integer('eabsentablestatus').notNullable().defaultTo(1);
    t.integer('eusereuserid').references('euser.euserid');
    t.integer('elocationelocationid').notNullable().references('elocation.elocationid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eabsen');