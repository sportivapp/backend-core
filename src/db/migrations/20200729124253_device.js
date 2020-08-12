exports.up = (knex, Promise) => knex.schema.createTable('edevice', t => {
    t.increments('edeviceid').primary().unsigned();
    // edeviceidinfo temporarily set to nullable
    t.string('edeviceidinfo', 256);
    t.string('edeviceimei', 17);
    t.integer('edevicecreateby').notNullable().defaultTo(0);
    t.bigInteger('edevicecreatetime').notNullable().defaultTo(Date.now());
    t.integer('edevicechangeby');
    t.bigInteger('edevicechangetime');
    t.integer('edevicetablestatus').notNullable().defaultTo(1);
    t.integer('edevicedeleteby');
    t.boolean('edevicedeletestatus').defaultTo(false);
    t.bigInteger('edevicedeletetime');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('edevice');