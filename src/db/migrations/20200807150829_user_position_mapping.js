exports.up = (knex, Promise) => knex.schema.createTable('euserpositionmapping', t => {
    t.integer('eusereuserid').notNullable().references('euser.euserid')
    t.integer('egradeegradeid').notNullable().references('egrade.egradeid')
    t.bigInteger('eassigncreatetime').notNullable().defaultTo(Date.now())
    t.integer('eassigncreateby').notNullable()
    t.bigInteger('eassigndeletetime')
    t.integer('eassigndeleteby')
    t.boolean('edeletestatus').defaultTo(false)
});

exports.down = (knex, Promise) => knex.schema.dropTable('euserpositionmapping');