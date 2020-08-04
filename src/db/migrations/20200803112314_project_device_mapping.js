exports.up = (knex, Promise) => knex.schema.createTable('eprojectdevicemapping', t => {
    t.integer('eprojectprojectid').notNullable().references('eproject.eprojectid')
    t.integer('edevicedeviceid').notNullable().references('edevice.edeviceid')
    t.bigInteger('eassigncreatetime').notNullable()
    t.integer('eassigncreateby').notNullable()
    t.bigInteger('eassigndeletetime')
    t.integer('eassigndeleteby')
    t.boolean('edeletestatus').defaultTo(false)
});

exports.down = (knex, Promise) => knex.schema.dropTable('eprojectdevicemapping');