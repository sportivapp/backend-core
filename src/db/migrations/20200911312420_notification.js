exports.up = (knex, Promise) => knex.schema.createTable('enotification', t => {
    t.increments('enotificationid').primary().unsigned();
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE')
    t.integer('enotificationbodyenotificationbodyid').notNullable().references('enotificationbody.enotificationbodyid').onDelete('CASCADE')
    t.boolean('enotificationisread').defaultTo(false)
});

exports.down = (knex, Promise) => knex.schema.dropTable('enotification');