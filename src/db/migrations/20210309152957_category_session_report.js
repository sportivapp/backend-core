exports.up = (knex, Promise) => knex.schema.createTable('category_session_report', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('class_category_uuid').references('class_category.uuid');
    t.uuid('class_category_session_uuid').references('class_category_session.uuid');
    t.string('reason');
    t.integer('report_type_id').references('session_report_type.id');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('category_session_report');