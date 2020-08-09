exports.up = (knex, Promise) => knex.schema.createTable('euserpositionmapping', t => {
    t.integer('eusereuserid').notNullable().references('euser.euserid')
    t.integer('egradeegradeid').notNullable().references('egrade.egradeid')
    t.bigInteger('euserpositionmappingcreatetime').notNullable().defaultTo(Date.now())
    t.integer('euserpositionmappingcreateby').notNullable()
    t.integer('euserpositionmappingchangeby');
    t.bigInteger('euserpositionmappingchangetime');
    t.bigInteger('euserpositionmappingdeletetime')
    t.boolean('euserpositionmappingdeletestatus').defaultTo(false);
    t.integer('euserpositionmappingdeleteby')
});

exports.down = (knex, Promise) => knex.schema.dropTable('euserpositionmapping');