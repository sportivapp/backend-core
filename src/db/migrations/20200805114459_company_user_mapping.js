exports.up = (knex, Promise) => knex.schema.createTable('ecompanyusermapping', t => {
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid')
    t.integer('eusereuserid').notNullable().references('euser.euserid')
    t.integer('ecompanyusermappingcreateby').notNullable();
    t.bigInteger('ecompanyusermappingcreatetime').notNullable().defaultTo(Date.now());
    t.integer('ecompanyusermappingchangeby');
    t.bigInteger('ecompanyusermappingchangetime');
    t.integer('ecompanyusermappingdeleteby');
    t.boolean('ecompanyusermappingdeletestatus').defaultTo(false);
    t.bigInteger('ecompanyusermappingdeletetime');
    t.boolean('edeletestatus').defaultTo(false)
});

exports.down = (knex, Promise) => knex.schema.dropTable('ecompanyusermapping');