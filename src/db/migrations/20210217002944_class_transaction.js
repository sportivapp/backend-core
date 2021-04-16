exports.up = (knex, Promise) => knex.schema.createTable('class_transaction', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('invoice').unique();
    t.integer('invoice_code').unique();
    t.uuid('class_uuid').references('class.uuid');
    t.uuid('class_category_uuid').references('class_category.uuid');
    t.integer('user_id');
    t.string('class_title');
    t.string('category_title');
    t.string('user_name');
    t.decimal('amount', 14, 2);
    t.enum('status', ['AWAITING_PAYMENT', 'PROCESSED', 'DONE', 'CANCELLED']).defaultTo('AWAITING_PAYMENT');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_transaction');