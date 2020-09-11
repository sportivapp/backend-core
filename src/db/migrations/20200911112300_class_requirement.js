exports.up = (knex, Promise) => knex.schema.createTable('eclassrequirement', t => {
    t.increments('eclassrequirementid').primary().unsigned();
    t.string('eclassrequirementname');
    t.integer('eclassrequirementcreateby').notNullable();
    t.bigInteger('eclassrequirementcreatetime').notNullable().defaultTo(Date.now());
    t.integer('eclassrequirementchangeby');
    t.bigInteger('eclassrequirementchangetime');
    t.boolean('eclassrequirementdeletestatus').defaultTo(false);
    t.integer('eclassrequirementtablestatus').notNullable().defaultTo(1);
    t.integer('eclasseclassid').notNullable().references('eclass.eclassid').onDelete('CASCADE')
});

exports.down = (knex, Promise) => knex.schema.dropTable('eclassrequirement');