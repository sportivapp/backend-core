exports.up = (knex, Promise) => knex.schema.createTable('ecompanymodulemapping', t => {
    t.increments('ecompanymodulemappingid').primary().unsigned();
    t.string('ecompanymodulemappingname').notNullable();
    t.bigInteger('ecompanymodulemappingcreatetime').notNullable().defaultTo(Date.now());
    t.integer('ecompanymodulemappingcreateby').notNullable().defaultTo(0);
    t.integer('ecompanymodulechangeby');
    t.bigInteger('ecompanymodulechangetime');
    t.integer('ecompanymoduledeleteby');
    t.boolean('ecompanymoduledeletestatus').defaultTo(false);
    t.bigInteger('ecompanymoduledeletetime');
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid');
    t.integer('emoduleemoduleid').notNullable().references('emodule.emoduleid');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ecompanymodulemapping');