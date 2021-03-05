exports.up = (knex, Promise) => knex.schema.createTable('class_category_price_log', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('class_uuid');
    t.uuid('class_category_uuid').references('class_category.uuid');
    t.decimal('price', 14, 2).notNullable();
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_category_price_log');