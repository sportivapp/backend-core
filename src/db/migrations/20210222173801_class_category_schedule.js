exports.up = (knex, Promise) => knex.schema.createTable('class_category_schedule', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('class_uuid').references('class.uuid');
    t.uuid('class_category_uuid').references('class_category.uuid');
    t.string('day');
    t.integer('day_code');
    t.integer('start_hour');
    t.integer('start_minute');
    t.integer('end_hour');
    t.integer('end_minute');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_category_schedule');