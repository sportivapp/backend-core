exports.up = (knex, Promise) => knex.schema.createTable('class', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('title').notNullable();
    t.text('description').notNullable();
    t.string('address').notNullable();
    t.string('address_name');
    t.string('pic_id');
    t.string('pic_mobile_number');
    t.decimal('administration_fee', 14, 2);
    t.integer('file_id');
    t.integer('company_id');
    t.integer('industry_id');
    t.integer('city_id');
    t.integer('state_id');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class');