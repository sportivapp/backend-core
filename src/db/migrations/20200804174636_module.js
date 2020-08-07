exports.up = (knex, Promise) => knex.schema.createTable('emodule', t => {
    t.increments('emoduleid').primary().unsigned();
    t.string('emodulename').notNullable();
    t.integer('emodulecreateby').notNullable().defaultTo(0);
    t.bigInteger('emodulecreatetime').notNullable().defaultTo(Date.now());
    t.integer('emodulechangeby');
    t.bigInteger('emodulechangetime');
    t.integer('emoduledeleteby');
    t.boolean('emoduledeletestatus').defaultTo(false);
    t.bigInteger('emoduledeletetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('emodule');