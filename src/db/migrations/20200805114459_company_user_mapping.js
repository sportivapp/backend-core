exports.up = (knex, Promise) => knex.schema.createTable('ecompanyusermapping', t => {
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE')
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE')
    t.integer('ecompanyusermappingpermission').notNullable();
    t.integer('ecompanyusermappingcreateby').notNullable();
    t.bigInteger('ecompanyusermappingcreatetime').notNullable().defaultTo(Date.now());
    t.integer('ecompanyusermappingchangeby');
    t.bigInteger('ecompanyusermappingchangetime');
    t.integer('ecompanyusermappingdeleteby');
    t.boolean('ecompanyusermappingdeletestatus').defaultTo(false);
    t.bigInteger('ecompanyusermappingdeletetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ecompanyusermapping');