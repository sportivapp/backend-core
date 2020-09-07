exports.up = (knex, Promise) => knex.schema.createTable('eproject', t => {
    t.increments('eprojectid').primary().unsigned();
    t.string('eprojectcode').notNullable();
    t.string('eprojectname').notNullable();
    t.string('eprojectdescription');
    t.string('eaddresslatitude');
    t.string('eaddresslongitude');
    t.bigInteger('eprojectstartdate').notNullable();
    t.bigInteger('eprojectenddate').notNullable();
    t.string('eprojectaddress');
    t.boolean('eprojectisactive').notNullable().defaultTo(true);
    t.integer('eprojectcreateby').notNullable();
    t.bigInteger('eprojectcreatetime').notNullable();
    t.integer('eprojectchangeby');
    t.bigInteger('eprojectchangetime');
    t.integer('eprojecttablestatus').notNullable().defaultTo(1);
    t.integer('eprojectsupervisorid').notNullable().references('euser.euserid');
    t.integer('eprojectparentid').references('eproject.eprojectid').onDelete('CASCADE');
    t.integer('ecompanyecompanyid').references('ecompany.ecompanyid').onDelete('CASCADE');
    t.integer('etimesheetetimesheetid').references('etimesheet.etimesheetid').onDelete('SET NULL');
    t.integer('eprojectdeleteby');
    t.boolean('eprojectdeletestatus').defaultTo(false);
    t.bigInteger('eprojectdeletetime');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eproject');