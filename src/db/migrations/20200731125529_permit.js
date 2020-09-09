exports.up = (knex) => knex.schema.createTable('epermit', t => {
    t.increments('epermitid').primary().unsigned();
    t.integer('epermitstatus').notNullable().defaultTo(0);
    t.string('epermitdescription').notNullable();
    t.bigInteger('epermitstartdate').notNullable();
    t.bigInteger('epermitenddate').notNullable();
    t.integer('epermitcreateby').notNullable();
    t.bigInteger('epermitcreatetime').notNullable().defaultTo(Date.now());
    t.integer('epermitchangeby');
    t.bigInteger('epermitchangetime');
    t.integer('epermittablestatus').notNullable().defaultTo(1);
    t.integer('eusereuserid').references('euser.euserid').onDelete('CASCADE');
    t.integer('epermitapprovaluserid').references('euser.euserid').onDelete('SET NULL');
    t.integer('ecompanyecompanyid').references('ecompany.ecompanyid').onDelete('CASCADE');
    t.integer('eprojectprojectid').references('eproject.eprojectid').onDelete('CASCADE');
    t.integer('euseruserid').references('euser.euserid').onDelete('CASCADE');
    t.integer('epermitdeleteby');
    t.bigInteger('epermitdeletetime');
    t.boolean('epermitdeletestatus').notNullable().defaultTo(false);
})

exports.down = (knex) => knex.schema.dropTable('epermit')
