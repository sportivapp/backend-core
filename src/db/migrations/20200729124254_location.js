exports.up = (knex, Promise) => knex.schema.createTable('elocation', t => {
    t.increments('elocationid').primary().unsigned();
    t.string('elocationcode', 7).notNullable();
    t.string('elocationname', 256);
    t.string('elocationdescription', 256);
    t.string('elocationlongitude', 51).notNullable();
    t.string('elocationlatitude', 51).notNullable();
    t.string('elocationaddress', 256);
    t.time('elocationtimein', false);
    t.time('elocationtimeout', false);
    t.string('elocationtotaltime', 256);
    t.integer('elocationcreateby').notNullable();
    t.bigInteger('elocationcreatetime', false).notNullable().defaultTo(Date.now());
    t.integer('elocationeditby');
    t.bigInteger('elocationedittime', false);
    t.integer('elocationdeleteby');
    t.bigInteger('elocationdeletetime', false);
    t.boolean('elocationdeletestatus').defaultTo(false);
    t.integer('elocationtablestatus').notNullable().defaultTo(1);
    t.integer('edeviceedeviceid').references('edevice.edeviceid').onDelete('SET NULL');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('elocation');