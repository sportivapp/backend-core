exports.up = (knex, Promise) => knex.schema.createTable('class_transaction_detail', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('class_uuid').references('class.uuid');
    t.uuid('class_category_uuid').references('class_category.uuid');
    t.uuid('class_category_session_uuid').references('class_category_session.uuid');
    t.uuid('class_transaction_uuid').references('class_transaction.uuid');
    t.integer('user_id').notNullable();
    t.bigInteger('paid_start_date').notNullable();
    t.bigInteger('paid_end_date').notNullable();
    t.string('invoice');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_transaction_detail');