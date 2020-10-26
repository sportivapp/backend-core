exports.up = (knex, Promise) => knex.schema.createTable('eteamlog', t => {
    t.increments('eteamlogid').primary().unsigned();
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE');
    t.integer('eteameteamid').notNullable().references('eteam.eteamid').onDelete('CASCADE');
    t.string('eteamlogmessage');
    t.enum('eteamlogtype', ['APPLY', 'INVITE']).notNullable();
    t.enum('eteamlogstatus', ['ACCEPTED', 'REJECTED', 'PENDING', 'KICKED']).defaultTo('PENDING');
    t.bigInteger('eteamlogcreatetime').notNullable();
    t.integer('eteamlogcreateby').notNullable();
    t.bigInteger('eteamlogchangetime');
    t.integer('eteamlogchangeby');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eteamlog');