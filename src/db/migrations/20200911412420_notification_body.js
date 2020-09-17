exports.up = (knex, Promise) => knex.schema.createTable('enotificationbody', t => {
    t.increments('enotificationbodyid').primary().unsigned();
    t.integer('enotificationbodyentityid')
    t.string('enotificationbodyentitytype')
    t.string('enotificationbodyaction')
    t.string('enotificationbodytitle')
    t.string('enotificationbodymessage')
    t.integer('enotificationbodysenderid').notNullable().references('euser.euserid').onDelete('CASCADE')
    t.integer('enotificationbodycreateby').notNullable();
    t.bigInteger('enotificationbodycreatetime').notNullable();
    t.integer('enotificationbodychangeby');
    t.bigInteger('enotificationbodychangetime');

});

exports.down = (knex, Promise) => knex.schema.dropTable('enotificationbody');