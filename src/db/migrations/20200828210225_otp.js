exports.up = (knex, Promise) => knex.schema.createTable('eotp', t => {
    t.increments('eotpid').primary().unsigned();
    t.string('euseremail').unique().notNullable();
    t.string('eotpcode').notNullable();
    t.boolean('eotpconfirmed').notNullable().defaultTo(false);
    t.bigInteger('eotpcreatetime').notNullable();
    t.integer('eotpcreateby').notNullable();
    t.bigInteger('eotpchangetime');
    t.integer('eotpchangeby');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eotp');