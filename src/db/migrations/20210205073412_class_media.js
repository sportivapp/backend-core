exports.up = (knex, Promise) => knex.schema.createTable('class_media', t => {
    t.specificType('id', 'serial');
    t.uuid('class_uuid').references('class.uuid');
    t.integer('file_id').references('efile.efileid').onDelete('CASCADE');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.boolean('delete_status').defaultTo(false);
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_media');