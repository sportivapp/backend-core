exports.up = (knex, Promise) => knex.schema.createTable('eabsen', t => {
    t.increments('eabsenid').primary().unsigned();
    t.string('eabsenlocationdistanceaccuracy', 256);
    t.string('eabsenstatus', 256);
    t.string('eabsendescription', 256);
    t.bigInteger('eabsentime').notNullable();
    t.integer('eabsensyncstatus');
    t.integer('eabsencreateby').notNullable();
    t.bigInteger('eabsencreatetime').notNullable().defaultTo(Date.now());
    t.integer('eabsenchangeby');
    t.bigInteger('eabsenchangetime');
    t.integer('eabsendeleteby');
    t.boolean('eabsendeletestatus').defaultTo(false);
    t.bigInteger('eabsendeletetime');
    t.integer('eabsentablestatus').notNullable().defaultTo(1);
    t.integer('eusereuserid').references('euser.euserid');
    t.integer('elocationelocationid').notNullable().references('elocation.elocationid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eabsen');