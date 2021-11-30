exports.up = (knex, Promise) => knex.schema.createTable('disbursement_request', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.enum('status', ['PROCESSING', 'WITHDRAWN']).defaultTo('PROCESSING');
    t.bigInteger('withdrawn_time');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('disbursement_request');