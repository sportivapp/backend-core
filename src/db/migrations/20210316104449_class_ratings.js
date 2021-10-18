exports.up = (knex, Promise) => knex.schema.createTable('class_ratings', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('class_uuid').references('class.uuid');
    t.uuid('class_category_uuid').references('class_category.uuid');
    t.uuid('class_category_session_uuid').references('class_category_session.uuid');
    t.uuid('class_category_participant_session_uuid').references('class_category_participant_session.uuid');
    t.integer('rating').notNullable();
    t.string('review');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_ratings');