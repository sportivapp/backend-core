exports.up = (knex, Promise) => knex.schema.createTable('class_complaint_medias', t => {
    t.specificType('id', 'serial');
    t.uuid('class_complaint_uuid').references('class_complaints.uuid');
    t.integer('file_id').references('efile.efileid').onDelete('CASCADE');
    t.integer('create_by').notNullable();
    t.bigInteger('create_time').notNullable();
    t.integer('change_by');
    t.bigInteger('change_time');
    t.bigInteger('delete_time');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_complaint_medias');