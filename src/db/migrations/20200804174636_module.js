exports.up = (knex, Promise) => knex.schema.createTable('emodule', t => {
    t.increments('emoduleid').primary().unsigned();
    t.string('emodulename').notNullable();
    t.bigInteger('emodulecreatetime').notNullable().defaultTo(Date.now());
    t.integer('emodulecreateby').notNullable().defaultTo(0);
});

exports.down = (knex, Promise) => knex.schema.dropTable('emodule');