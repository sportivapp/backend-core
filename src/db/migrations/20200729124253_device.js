exports.up = (knex, Promise) => knex.schema.createTable('edevice', t => {
    t.increments('edeviceid').primary().unsigned();
    // edeviceidinfo temporarily set to nullable
    t.string('edeviceidinfo', 256);
    t.string('edeviceimei', 17);
    t.integer('edevicecreateby').notNullable();
    t.bigInteger('edevicecreatetime', false).notNullable().defaultTo(Date.now());
    t.integer('edeviceeditby');
    t.bigInteger('edeviceedittime', false);
    t.integer('edevicedeleteby');
    t.bigInteger('edevicedeletetime', false);
    t.boolean('edevicedeletestatus').defaultTo(false);
    t.integer('edevicetablestatus').notNullable().defaultTo(1);
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('edevice');