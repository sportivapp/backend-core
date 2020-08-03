exports.up = (knex, Promise) => knex.schema.createTable('eprojectdevicemapping', t => {
    t.integer('eprojectprojectid').notNullable().references('eproject.eprojectid')
    t.integer('edevicedeviceid').notNullable().references('edevice.edeviceid')
});

exports.down = (knex, Promise) => knex.schema.dropTable('eprojectdevicemapping');