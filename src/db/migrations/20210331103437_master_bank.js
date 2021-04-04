exports.up = (knex, Promise) => knex.schema.createTable('master_bank', t => {
    t.increments('id').primary().unsigned();
    t.string('name').notNullable();
    t.string('code').notNullable();
});

exports.down = (knex, Promise) => knex.schema.dropTable('master_bank');