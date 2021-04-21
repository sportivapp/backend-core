//FILE TO DELETE IF PAYMENT SEPARATED
exports.up = (knex, Promise) => knex.schema.createTable('doku_payment', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.enum('status', ['AWAITING_PAYMENT', 'DONE', 'FAIL']).defaultTo('AWAITING_PAYMENT').notNullable();
    t.bigInteger('time_limit');
    t.string('trans_id_merchant').notNullable();
    t.decimal('amount', 14, 2).notNullable();
    t.decimal('purchase_amount', 14, 2).notNullable();
    t.string('approval_code');
    t.string('request_date_time').notNullable();
    t.integer('currency').notNullable().defaultTo(360);
    t.integer('purchase_currency').notNullable().defaultTo(360);
    t.string('session_id').notNullable();
    t.string('basket').notNullable();
    t.string('payment_channel').notNullable();
    t.string('customer_name').notNullable();
    t.string('customer_email').notNullable();
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('doku_payment');