//FILE TO DELETE IF PAYMENT SEPARATED
exports.up = (knex, Promise) => knex.schema.createTable('bca_request', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.enum('status', ['AWAITING_PAYMENT', 'DONE', 'FAIL']).defaultTo('AWAITING_PAYMENT').notNullable();
    t.bigInteger('time_limit');
    t.string('bca_request_id');
    t.string('bca_transaction_date');
    t.string('bca_channel_type');
    t.string('sub_company_id');
    t.string('invoice').notNullable();
    t.decimal('amount', 14, 2).notNullable();
    t.string('currency').notNullable().defaultTo('IDR');
    t.string('customer_name').notNullable();
    t.string('customer_email').notNullable();
    t.string('va_number').notNullable();
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('bca_request');