exports.up = (knex, Promise) => knex.schema.createTable('xendit_payment', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('invoice').unique().notNullable();
    t.decimal('amount', 14, 2).notNullable();
    t.string('description');
    t.timestamp('expiry_date').notNullable();
    t.string('name');
    t.string('email');
    t.string('items');
    t.enum('status', ['AWAITING_PAYMENT', 'PAID', 'CANCELLED_OR_EXPIRED', 'REFUSED_OR_ERROR', 'REFUNDED']);
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('xendit_payment');