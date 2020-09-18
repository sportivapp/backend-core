exports.up = (knex, Promise) => knex.schema.createTable('eforget', t => {
    t.increments('eforgetid').primary().unsigned();
    t.string('euseremail').unique().notNullable();
    t.string('eforgetvalue').notNullable();
    t.boolean('eforgetconfirmed').notNullable().defaultTo(false);
    t.bigInteger('eforgetcreatetime').notNullable();
    t.integer('eforgetcreateby').notNullable();
    t.bigInteger('eforgetchangetime');
    t.integer('eforgetchangeby');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eforget');