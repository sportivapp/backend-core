exports.up = (knex, Promise) => knex.schema.createTable('disbursement', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.integer('user_id').references('euser.euserid').notNullable();
    t.uuid('xendit_payment_uuid').references('xendit_payment.uuid').notNullable();
    t.string('invoice').notNullable();
    t.decimal('amount', 14, 2).notNullable();
    t.enum('status', ['PENDING', 'PROCESSING', 'WITHDRAWN']).defaultTo('PENDING');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('disbursement');