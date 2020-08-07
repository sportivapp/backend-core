exports.up = (knex, Promise) => knex.schema.createTable('eproject', t => {
    t.increments('eprojectid').primary().unsigned();
    t.string('eprojectcode').notNullable();
    t.string('eprojectname').notNullable();
    t.string('eprojectdescription');
    t.string('eaddresslatitude');
    t.string('eaddresslongitude');
    t.date('eprojectstartdate', true).notNullable();
    t.date('eprojectenddate', true).notNullable();
    t.string('eprojectaddress');
    t.boolean('eprojectisactive').notNullable().defaultTo(true);
    t.integer('eprojectcreateby').notNullable();
    t.bigInteger('eprojectcreatetime').notNullable().defaultTo(Date.now());
    t.integer('eprojectchangeby');
    t.bigInteger('eprojectchangetime');
    t.integer('eprojectdeleteby');
    t.boolean('eprojectdeletestatus').defaultTo(false);
    t.bigInteger('eprojectdeletetime');
    t.integer('eprojecttablestatus').notNullable().defaultTo(1);
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eproject');