exports.up = (knex, Promise) => knex.schema.createTable('edevice', t => {
    t.increments('edeviceid').primary().unsigned();
    t.string('edeviceidinfo', 256);
    t.string('edeviceimei', 17).notNullable();
    t.integer('edevicecreateby').notNullable();
    t.bigInteger('edevicecreatetime').notNullable();
    t.integer('edevicechangeby');
    t.bigInteger('edevicechangetime');
    t.integer('edevicetablestatus').notNullable().defaultTo(1);
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid');
    t.integer('edevicedeleteby');
    t.boolean('edevicedeletestatus').defaultTo(false);
    t.bigInteger('edevicedeletetime');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('edevice');