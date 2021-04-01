exports.up = (knex, Promise) => knex.schema.createTable('class_category_session', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('class_uuid');
    t.uuid('class_category_uuid').references('class_category.uuid');
    t.decimal('price', 14, 2).defaultTo(0);
    t.bigInteger('month_utc');
    t.enum('status', ['UPCOMING', 'ONGOING', 'DONE']).defaultTo('UPCOMING');
    t.bigInteger('init_start_date').notNullable();
    t.bigInteger('init_end_date').notNullable();
    t.bigInteger('start_date').notNullable();
    t.bigInteger('end_date').notNullable();
    t.bigInteger('start_time');
    t.integer('start_by');
    t.bigInteger('end_time');
    t.integer('end_by');
    t.bigInteger('absence_time');
    t.integer('absence_by');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_category_session');