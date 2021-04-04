exports.up = (knex, Promise) => knex.schema.createTable('class_complaints', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('class_uuid').references('class.uuid');
    t.uuid('class_category_uuid').references('class_category.uuid');
    t.uuid('class_category_session_uuid').references('class_category_session.uuid');
    t.uuid('class_category_participant_session_uuid').references('class_category_participant_session.uuid');
    t.string('complaint');
    t.string('code');
    t.string('status').defaultTo('AWAITING_CONFIRMATION');
    t.boolean('coach_accept');
    t.string('coach_reason');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_complaints');