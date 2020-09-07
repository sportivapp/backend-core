exports.up = (knex, Promise) => knex.schema.createTable('eprojectdevicemapping', t => {
    t.integer('eprojectprojectid').notNullable().references('eproject.eprojectid').onDelete('CASCADE');
    t.integer('edevicedeviceid').notNullable().references('edevice.edeviceid').onDelete('CASCADE');
    t.integer('eprojectdevicemappingcreateby').notNullable();
    t.bigInteger('eprojectdevicemappingcreatetime').notNullable().defaultTo(Date.now());
    t.integer('eprojectdevicemappingchangeby');
    t.bigInteger('eprojectdevicemappingchangetime');
    t.integer('eprojectdevicemappingdeleteby');
    t.boolean('eprojectdevicemappingdeletestatus').defaultTo(false);
    t.bigInteger('eprojectdevicemappingdeletetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eprojectdevicemapping');