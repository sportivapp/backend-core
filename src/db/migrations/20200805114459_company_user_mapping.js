exports.up = (knex, Promise) => knex.schema.createTable('ecompanyusermapping', t => {
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid')
    t.integer('eusereuserid').notNullable().references('euser.euserid')
    t.bigInteger('eassigncreatetime').notNullable().defaultTo(Date.now())
    t.integer('eassigncreateby').notNullable()
    t.bigInteger('eassigndeletetime')
    t.integer('eassigndeleteby')
    t.boolean('edeletestatus').defaultTo(false)
});

exports.down = (knex, Promise) => knex.schema.dropTable('ecompanyusermapping');