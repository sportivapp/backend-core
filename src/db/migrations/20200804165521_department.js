exports.up = (knex, Promise) => knex.schema.createTable('edepartment', t => {
    t.increments('edepartmentid').primary().unsigned();
    t.string('edepartmentname', 256).notNullable();
    t.string('edepartmentdescription', 256).notNullable();
    t.integer('edepartmentcreateby').notNullable();
    t.bigInteger('edepartmentcreatetime', false).notNullable().defaultTo(Date.now());
    t.integer('edepartmentchangeby');
    t.bigInteger('edepartmentchangetime', false);
    t.integer('edepartmenttablestatus').notNullable().defaultTo(1);
    t.integer('edepartmentsuperiorid').references('edepartment.edepartmentid')
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid')
});

exports.down = (knex, Promise) => knex.schema.dropTable('edepartment');