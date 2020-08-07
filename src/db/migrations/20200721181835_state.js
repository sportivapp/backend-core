exports.up = (knex, Promise) => knex.schema.createTable('estate', t => {
    t.increments('estateid').primary().unsigned();
    t.string('estatename').notNullable();
    t.string('estatecode');
    t.integer('estatecreateby').notNullable().defaultTo(0);
    t.bigInteger('estatecreatetime', true).notNullable().defaultTo(Date.now());
    t.integer('estatechangeby');
    t.bigInteger('estatechangetime', true);
    t.integer('estatetablestatus').notNullable().defaultTo(1);
    t.integer('ecountryecountryid').notNullable().references('ecountry.ecountryid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('estate');