exports.up = (knex, Promise) => knex.schema.createTable('esporttype', t => {
    t.increments('esporttypeid').primary().unsigned();
    t.string('esporttypename').notNullable();
});

exports.down = (knex, Promise) => knex.schema.dropTable('esporttype');