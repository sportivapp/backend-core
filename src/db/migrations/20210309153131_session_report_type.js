exports.up = (knex, Promise) => knex.schema.createTable('session_report_type', t => {
    t.increments('id').unsigned().primary();
    t.string('name');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('session_report_type');