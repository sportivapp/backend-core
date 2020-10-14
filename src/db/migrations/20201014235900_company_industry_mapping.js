exports.up = (knex, Promise) => knex.schema.createTable('ecompanyindustrymapping', t => {
    t.increments('ecompanyindustrymappingid').primary().unsigned();
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE')
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE')
    t.integer('ecompanyindustrymappingcreateby').notNullable();
    t.bigInteger('ecompanyindustrymappingcreatetime').notNullable();
    t.integer('ecompanyindustrymappingchangeby');
    t.bigInteger('ecompanyindustrymappingchangetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ecompanyindustrymapping');