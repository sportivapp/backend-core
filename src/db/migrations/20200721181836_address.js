exports.up = (knex, Promise) => knex.schema.createTable('eaddress', t => {
    t.increments('eaddressid').primary().unsigned();
    t.string('eaddressstreet').notNullable();
    t.integer('eaddresspostalcode').notNullable();
    t.string('eaddresslongitude');
    t.string('eaddresslatitude');
    t.integer('eaddresscreateby').notNullable().defaultTo(0);
    t.bigInteger('eaddresscreatetime').notNullable().defaultTo(Date.now());
    t.integer('eaddresschangeby');
    t.bigInteger('eaddresschangetime');
    t.integer('eaddressdeleteby');
    t.bigInteger('eaddressdeletetime');
    t.boolean('eaddressdeletestatus').defaultTo(false);
    t.integer('eaddresstablestatus').notNullable().defaultTo(1);
    // t.integer('ecountryecountryid').notNullable().references('ecountry.ecountryid');
    // t.integer('estateestateid').notNullable().references('estate.estateid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eaddress');