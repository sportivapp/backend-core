exports.up = (knex, Promise) => knex.schema.createTable('ecountry', t => {
    t.increments('ecountryid').primary().unsigned();
    t.string('ecountryname').notNullable();
    t.integer('ecountrycreateby').notNullable().defaultTo(0);
    t.bigInteger('ecountrycreatetime').notNullable().defaultTo(Date.now());
    t.integer('ecountrychangeby');
    t.bigInteger('ecountrychangetime');
    t.integer('ecountrydeleteby');
    t.bigInteger('ecountrydeletetime');
    t.boolean('ecountrydeletestatus').defaultTo(false);
    t.integer('ecountrytablestatus').notNullable().defaultTo(1);
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('ecountry');