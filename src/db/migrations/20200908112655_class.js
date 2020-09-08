exports.up = (knex, Promise) => knex.schema.createTable('eclass', t => {
    t.increments('eclassid').primary().unsigned();
    t.string('eclassname').notNullable();
    t.bigInteger('eclassstartdate').notNullable();
    t.bigInteger('eclassenddate').notNullable();
    t.bigInteger('eclassstarthour').notNullable();
    t.bigInteger('eclassstartminute').notNullable();
    t.bigInteger('eclassendhour').notNullable();
    t.bigInteger('eclassendminute').notNullable();
    t.string('eclassrequirement');
    t.string('eclassdescription');
    t.enum('eclasstype', ['PUBLIC', 'PRIVATE']);
    t.integer('eclassprice').notNullable();
    t.integer('eclasscreateby').notNullable();
    t.bigInteger('eclasscreatetime').notNullable().defaultTo(Date.now());
    t.integer('eclasschangeby');
    t.bigInteger('eclasschangetime');
    t.boolean('eclassdeletestatus').defaultTo(false);
    t.integer('eclasstablestatus').notNullable().defaultTo(1);
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE')
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE')
});

exports.down = (knex, Promise) => knex.schema.dropTable('eclass');