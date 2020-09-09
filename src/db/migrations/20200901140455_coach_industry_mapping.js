exports.up = (knex, Promise) => knex.schema.createTable('ecoachindustrymapping', t => {
    t.increments('ecoachindustrymappingid').primary().unsigned();
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE')
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE')
    t.integer('ecoachindustrymappingcreateby').notNullable();
    t.bigInteger('ecoachindustrymappingcreatetime').notNullable();
    t.integer('ecoachindustrymappingchangeby');
    t.bigInteger('ecoachindustrymappingchangetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ecoachindustrymapping');