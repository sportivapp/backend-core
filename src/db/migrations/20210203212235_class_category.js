exports.up = (knex, Promise) => knex.schema.createTable('class_category', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('title').notNullable();
    t.text('description').notNullable();
    t.decimal('price', 14, 2).defaultTo(0);
    t.string('requirements');
    t.integer('min_participant');
    t.integer('max_participant');
    t.boolean('on_hold').defaultTo(false);
    t.boolean('is_recurring').defaultTo(true);
    t.uuid('class_uuid').references('class.uuid');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_category');