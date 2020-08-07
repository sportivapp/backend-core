exports.up = (knex, Promise) => knex.schema.createTable('eabsen', t => {
    t.increments('eabsenid').primary().unsigned();
    t.string('eabsenlocationdistanceaccuracy', 256);
    t.string('eabsenstatus', 256);
    t.string('eabsendescription', 256);
    t.bigInteger('eabsentime', false).notNullable();
    t.integer('eabsensyncstatus');
    t.integer('eabsencreateby').notNullable();
    t.bigInteger('eabsencreatetime', false).notNullable().defaultTo(Date.now());
    t.integer('eabseneditby');
    t.bigInteger('eabsenedittime', false);
    t.integer('eabsendeleteby');
    t.bigInteger('eabsendeletetime', false);
    t.boolean('eabsendeletestatus').defaultTo(false);
    t.integer('eabsentablestatus').notNullable().defaultTo(1);
    t.integer('eusereuserid').references('euser.euserid');
    t.integer('elocationelocationid').notNullable().references('elocation.elocationid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eabsen');