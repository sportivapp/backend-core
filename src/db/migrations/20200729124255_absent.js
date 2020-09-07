exports.up = (knex, Promise) => knex.schema.createTable('eabsen', t => {
    t.increments('eabsenid').primary().unsigned();
    t.string('eabsendescription', 256);
    t.bigInteger('eabsenclockintime').notNullable();
    t.bigInteger('eabsenclockinimageid').references('efile.efileid').onDelete('SET NULL');
    t.bigInteger('eabsenclockouttime');
    t.bigInteger('eabsenclockoutimageid').references('efile.efileid').onDelete('SET NULL');
    t.bigInteger('eabsenlatetime').defaultTo(0);
    t.bigInteger('eabsenearlyleavetime').defaultTo(0);
    t.bigInteger('eabsenovertime').defaultTo(0);
    t.integer('eabsensyncstatus');
    t.integer('eabsencreateby').notNullable();
    t.bigInteger('eabsencreatetime').notNullable();
    t.integer('eabsenchangeby');
    t.bigInteger('eabsenchangetime');
    t.integer('eabsendeleteby');
    t.boolean('eabsendeletestatus').defaultTo(false);
    t.bigInteger('eabsendeletetime');
    t.integer('eabsentablestatus').notNullable().defaultTo(1);
    t.integer('eusereuserid').notNullable().references('euser.euserid');
    t.integer('edeviceedeviceid').notNullable().references('edevice.edeviceid')
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eabsen');