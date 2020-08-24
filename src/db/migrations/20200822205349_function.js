exports.up = (knex, Promise) => knex.schema.createTable('efunction', t => {
    t.increments('efunctionid').primary().unsigned();
    t.string('efunctioncode').notNullable().unique();
    t.string('efunctionname').notNullable();
});

exports.down = (knex, Promise) => knex.schema.dropTable('efunction');