exports.up = (knex, Promise) => knex.schema.createTable('eaddress', t => {
    t.increments('eaddressid').primary().unsigned();
    t.integer('ecountryecountryid').notNullable().references('ecountry.ecountryid');
    t.integer('estatesestatesid').notNullable().references('estates.estatesid');
    t.string('eaddressstreet').notNullable();
    t.integer('eaddresspostalcode').notNullable();
    t.string('eaddresslongitude');
    t.string('eaddresslatitude');
    t.integer('eaddresscreateby').notNullable().defaultTo(0);
    t.timestamp('eaddresscreatetime', true).notNullable().defaultTo(knex.fn.now());
    t.integer('eaddresschangeby');
    t.timestamp('eaddresschangetime', true);
    t.integer('eaddresstablestatus').notNullable().defaultTo(1);
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eaddress');