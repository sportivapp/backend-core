// NOT USED ANYMORE
exports.up = (knex, Promise) => knex.schema.createTable('eteamindustrymapping', t => {
    t.increments('eteamindustrymappingid').primary().unsigned();
    t.integer('eteameteamid').notNullable().references('eteam.eteamid').onDelete('CASCADE')
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE')
    t.integer('eteamindustrymappingcreateby').notNullable();
    t.bigInteger('eteamindustrymappingcreatetime').notNullable();
    t.integer('eteamindustrymappingchangeby');
    t.bigInteger('eteamindustrymappingchangetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eteamindustrymapping');