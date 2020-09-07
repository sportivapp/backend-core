exports.up = (knex, Promise) => knex.schema.createTable('euserpositionmapping', t => {
    t.increments('euserpositionmappingid').primary().unsigned();
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE')
    t.integer('egradeegradeid').notNullable().references('egrade.egradeid').onDelete('CASCADE')
    t.bigInteger('euserpositionmappingcreatetime').notNullable().defaultTo(Date.now())
    t.integer('euserpositionmappingcreateby').notNullable()
    t.integer('euserpositionmappingchangeby');
    t.bigInteger('euserpositionmappingchangetime');
    t.bigInteger('euserpositionmappingdeletetime')
    t.boolean('euserpositionmappingdeletestatus').defaultTo(false);
    t.integer('euserpositionmappingdeleteby')
});

exports.down = (knex, Promise) => knex.schema.dropTable('euserpositionmapping');