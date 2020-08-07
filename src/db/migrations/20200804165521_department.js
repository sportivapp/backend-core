exports.up = (knex, Promise) => knex.schema.createTable('edepartment', t => {
    t.increments('edepartmentid').primary().unsigned();
    t.string('edepartmentname', 256).notNullable();
    t.string('edepartmentdescription', 256).notNullable();
    t.integer('edepartmentcreateby').notNullable();
    t.bigInteger('edepartmentcreatetime').notNullable().defaultTo(Date.now());
    t.integer('edepartmentchangeby');
    t.bigInteger('edepartmentchangetime');
    t.integer('edepartmentdeleteby');
    t.boolean('edepartmentdeletestatus').defaultTo(false);
    t.bigInteger('edepartmentdeletetime');
    t.integer('edepartmenttablestatus').notNullable().defaultTo(1);
    t.integer('edepartmentsuperiorid').references('edepartment.edepartmentid')
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE')
});

exports.down = (knex, Promise) => knex.schema.dropTable('edepartment');