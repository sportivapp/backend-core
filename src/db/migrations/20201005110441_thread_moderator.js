exports.up = (knex, Promise) => knex.schema.createTable('ethreadmoderator', t => {
    t.increments('ethreadmoderatorid').primary().unsigned();
    t.integer('ethreadethreadid').notNullable().references('ethread.ethreadid').onDelete('CASCADE');
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE');
    t.bigInteger('ethreadmoderatorcreatetime').notNullable();
    t.integer('ethreadmoderatorcreateby').notNullable();
    t.bigInteger('ethreadmoderatorchangetime');
    t.integer('ethreadmoderatorchangeby');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ethreadmoderator');