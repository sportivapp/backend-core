exports.up = (knex, Promise) => knex.schema.createTable('enotification', t => {
    t.increments('enotificationid').primary().unsigned();
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE')
    t.integer('enotificationbodyenotificationbodyid').notNullable().references('enotificationbody.enotificationbodyid').onDelete('CASCADE')
    t.boolean('enotificationisread').defaultTo(false);
    t.integer('enotificationcreateby').notNullable();
    t.bigInteger('enotificationcreatetime').notNullable();
    t.integer('enotificationchangeby');
    t.bigInteger('enotificationchangetime');

});

exports.down = (knex, Promise) => knex.schema.dropTable('enotification');