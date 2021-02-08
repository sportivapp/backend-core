exports.up = (knex, Promise) => knex.schema.createTable('class_category', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('title').notNullable();
    t.string('description').notNullable();
    t.decimal('price', 14, 2).notNullable();
    t.json('requirements');
    t.uuid('class_uuid').references('class.uuid');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.boolean('delete_status').defaultTo(false);
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_category');