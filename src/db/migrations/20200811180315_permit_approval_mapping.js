exports.up = (knex, Promise) => knex.schema.createTable('epermitapprovalmapping', t => {
    t.integer('eusereuserid').notNullable().references('euser.euserid')
    t.integer('epermitepermitid').notNullable().references('epermit.epermitid')
    t.integer('epermitapprovalmappingstatus').notNullable().defaultTo(1)
    t.bigInteger('epermitapprovalmappingcreatetime').notNullable()
    t.integer('epermitapprovalmappingcreateby').notNullable()
    t.integer('epermitapprovalmappingchangeby');
    t.bigInteger('epermitapprovalmappingchangetime');
    t.bigInteger('epermitapprovalmappingdeletetime')
    t.boolean('epermitapprovalmappingdeletestatus').defaultTo(false);
    t.integer('epermitapprovalmappingdeleteby')
});

exports.down = (knex, Promise) => knex.schema.dropTable('epermitapprovalmapping');