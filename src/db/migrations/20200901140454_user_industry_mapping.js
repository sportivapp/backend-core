exports.up = (knex, Promise) => knex.schema.createTable('euserindustrymapping', t => {
    t.increments('euserindustrymappingid').primary().unsigned();
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE')
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE')
    t.integer('euserindustrymappingcreateby').notNullable();
    t.bigInteger('euserindustrymappingcreatetime').notNullable();
    t.integer('euserindustrymappingchangeby');
    t.bigInteger('euserindustrymappingchangetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('euserindustrymapping');