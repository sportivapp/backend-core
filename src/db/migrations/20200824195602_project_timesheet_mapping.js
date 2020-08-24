exports.up = (knex, Promise) => knex.schema.createTable('eprojecttimesheetmapping', t => {
    t.integer('eprojectprojectid').notNullable().references('eproject.eprojectid').onDelete('CASCADE');
    t.integer('etimesheetetimesheetid').notNullable().references('etimesheet.etimesheetid').onDelete('CASCADE');
    t.integer('eprojecttimesheetmappingcreateby').notNullable();
    t.bigInteger('eprojecttimesheetmappingcreatetime').notNullable().defaultTo(Date.now());
    t.integer('eprojecttimesheetmappingchangeby');
    t.bigInteger('eprojecttimesheetmappingchangetime');
    t.integer('eprojecttimesheetmappingdeleteby');
    t.boolean('eprojecttimesheetmappingdeletestatus').defaultTo(false);
    t.bigInteger('eprojecttimesheetmappingdeletetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eprojecttimesheetmapping');