exports.up = (knex, Promise) => knex.schema.createTable('elocation', t => {
    t.increments('elocationid').primary().unsigned();
    t.string('elocationcode', 7).notNullable();
    t.string('elocationname', 256);
    t.string('elocationdescription', 256);
    t.string('elocationlongitude', 51).notNullable();
    t.string('elocationlattitude', 51).notNullable();
    t.string('elocationaddress', 256);
    t.time('elocationtimein', false);
    t.time('elocationtimeout', false);
    t.string('elocationtotaltime', 256);
    t.integer('elocationcreateby').notNullable();
    t.timestamp('elocationcreatetime', false).notNullable().defaultTo(knex.fn.now());
    t.integer('elocationeditby');
    t.timestamp('elocationedittime', false);
    t.integer('elocationdeleteby');
    t.timestamp('elocationdeletetime', false);
    t.integer('elocationdeletestatus').defaultTo(0);
    t.integer('elocationtablestatus').notNullable().defaultTo(1);
    // t.integer('edeviceedeviceid').notNullable().references('edevice.edeviceid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('elocation');