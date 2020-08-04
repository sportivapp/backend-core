exports.up = (knex, Promise) => knex.schema.createTable('ecompanymodulemapping', t => {
    t.integer('ecompanymodulemappingid').primary().unsigned();
    t.string('ecompanymodulemappingname').notNullable();
    t.bigInteger('ecompanymodulemappingcreatetime').notNullable().defaultTo(knex.fn.now());
    t.integer('ecompanymodulemappingcreateby').notNullable().defaultTo(0);
    t.bigInteger('ecompanymodulemappingedittime');
    t.integer('ecompanymodulemappingeditby');
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid');
    t.integer('emoduleemoduleid').notNullable().references('emodule.emoduleid');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ecompanymodulemapping');