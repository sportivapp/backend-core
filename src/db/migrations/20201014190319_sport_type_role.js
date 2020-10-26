exports.up = (knex, Promise) => knex.schema.createTable('esporttyperole', t => {
    t.increments('esporttyperoleid').notNullable().primary().unsigned()
    t.string('esporttyperolename').notNullable()
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE')
    t.bigInteger('esporttyperolecreatetime').notNullable()
    t.integer('esporttyperolecreateby').notNullable()
    t.integer('esporttyperolechangeby');
    t.bigInteger('esporttyperolechangetime');
    t.bigInteger('esporttyperoledeletetime')
    t.boolean('esporttyperoledeletestatus').defaultTo(false);
    t.integer('esporttyperoledeleteby')
});

exports.down = (knex, Promise) => knex.schema.dropTable('esporttyperole');