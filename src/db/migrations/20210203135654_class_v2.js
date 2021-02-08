exports.up = (knex, Promise) => knex.schema.createTable('class', t => {
    t.specificType('id', 'serial');
    t.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('title').notNullable();
    t.string('description').notNullable();
    t.string('address').notNullable();
    t.string('pic_name');
    t.string('pic_mobile_number');
    t.decimal('administration_fee', 14, 2);
    t.integer('file_id');
    t.integer('company_id');
    t.integer('industry_id');
    t.integer('city_id');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.boolean('delete_status').defaultTo(false);
});

exports.down = (knex, Promise) => knex.schema.dropTable('class');