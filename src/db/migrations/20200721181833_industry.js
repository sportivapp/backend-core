exports.up = (knex, Promise) => knex.schema.createTable('eindustry', t => {
    t.increments('eindustryid').notNullable().primary().unsigned()
    t.text('eindustryname').notNullable()
    t.bigInteger('eindustrycreatetime').notNullable().defaultTo(Date.now())
    t.integer('eindustrycreateby').notNullable().defaultTo(0)
    t.integer('eindustrychangeby');
    t.bigInteger('eindustrychangetime');
    t.bigInteger('eindustrydeletetime')
    t.boolean('eindustrydeletestatus').defaultTo(false);
    t.integer('eindustrydeleteby')
});

exports.down = (knex, Promise) => knex.schema.dropTable('eindustry');