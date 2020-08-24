exports.up = (knex, Promise) => knex.schema.createTable('emodule', t => {
    t.increments('emoduleid').primary().unsigned();
    t.string('emodulename').notNullable();
});

exports.down = (knex, Promise) => knex.schema.dropTable('emodule');