exports.up = (knex, Promise) => knex.schema.createTable('edevice', t => {
    t.increments('edeviceid').primary().unsigned();
    t.string('edeviceidinfo', 256).notNullable();
    t.string('edeviceimei', 17);
    t.integer('edevicecreateby').notNullable();
    t.timestamp('edevicecreatetime', false).notNullable().defaultTo(knex.fn.now());
    t.integer('edeviceeditby');
    t.timestamp('edeviceedittime', false);
    t.integer('edevicedeleteby');
    t.timestamp('edevicedeletetime', false);
    t.integer('edevicedeletestatus').defaultTo(0);
    t.integer('edevicetablestatus').notNullable().defaultTo(1);
    t.integer('eprojecteprojectid').notNullable().references('eproject.eprojectid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('edevice');