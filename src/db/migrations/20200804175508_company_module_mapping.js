exports.up = (knex, Promise) => knex.schema.createTable('ecompanymodulemapping', t => {
    t.increments('ecompanymodulemappingid').primary().unsigned();
    t.string('ecompanymodulemappingname').notNullable();
    t.bigInteger('ecompanymodulemappingcreatetime').notNullable().defaultTo(Date.now());
    t.integer('ecompanymodulemappingcreateby').notNullable().defaultTo(0);
    t.integer('ecompanymodulemappingchangeby');
    t.bigInteger('ecompanymodulemappingchangetime');
    t.integer('ecompanymodulemappingdeleteby');
    t.boolean('ecompanymodulemappingdeletestatus').defaultTo(false);
    t.bigInteger('ecompanymodulemappingdeletetime');
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid');
    t.integer('emoduleemoduleid').notNullable().references('emodule.emoduleid');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ecompanymodulemapping');