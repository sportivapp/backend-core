exports.up = (knex, Promise) => knex.schema.createTable('eteamsporttyperoles', t => {
    t.increments('eteamsporttyperolesid').notNullable().primary().unsigned()
    t.integer('eteamusermappingeteamusermappingid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE')
    t.integer('esporttyperoleesporttyperoleid').notNullable().references('esporttyperole.esporttyperoleid').onDelete('CASCADE')
    t.integer('eteameteamid').notNullable().references('eteam.eteamid').onDelete('CASCADE')
    t.bigInteger('eteamsporttyperolescreatetime').notNullable()
    t.integer('eteamsporttyperolescreateby').notNullable()
    t.integer('eteamsporttyperoleschangeby');
    t.bigInteger('eteamsporttyperoleschangetime');
    t.bigInteger('eteamsporttyperolesdeletetime')
    t.boolean('eteamsporttyperolesdeletestatus').defaultTo(false);
    t.integer('eteamsporttyperolesdeleteby')
});

exports.down = (knex, Promise) => knex.schema.dropTable('eteamsporttyperoles');