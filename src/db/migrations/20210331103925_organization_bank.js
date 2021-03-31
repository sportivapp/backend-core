exports.up = (knex, Promise) => knex.schema.createTable('organization_bank', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.integer('company_id').references('ecompany.ecompanyid').notNullable();
    t.integer('master_bank_id').references('master_bank.id').notNullable();
    t.string('account_name').notNullable();
    t.string('account_number').unique().notNullable();
    t.boolean('is_main').defaultTo(false);
    t.enum('status', ['PENDING', 'VERIFIED', 'REJECTED']).defaultTo('PENDING');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('organization_bank');