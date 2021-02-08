exports.up = (knex, Promise) => knex.schema.createTable('class_category_participant', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('class_category_uuid').references('class_category.uuid');
    t.integer('user_id');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.boolean('delete_status').defaultTo(false);
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_category_participant');