exports.up = (knex, Promise) => knex.schema.createTable('eshift', t => {
    t.increments('eshiftid').primary().unsigned();
    t.string('eshiftname').notNullable();
    t.bigInteger('eshiftstartdate').notNullable();
    t.bigInteger('eshiftenddate').notNullable();
    t.integer('eshiftcreateby').notNullable();
    t.bigInteger('eshiftcreatetime').notNullable();
    t.integer('eshiftchangeby');
    t.bigInteger('eshiftchangetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eshift');