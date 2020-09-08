exports.up = (knex, Promise) => knex.schema.createTable('ecompanylog', t => {
    t.increments('ecompanylogid').primary().unsigned();
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE');
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE');
    t.string('ecompanylogmessage');
    t.enum('ecompanylogtype', ['APPLY', 'INVITE']).notNullable();
    t.enum('ecompanylogstatus', ['ACCEPTED', 'REJECTED', 'PENDING']).defaultTo('PENDING');
    t.bigInteger('ecompanylogcreatetime').notNullable();
    t.integer('ecompanylogcreateby').notNullable();
    t.bigInteger('ecompanylogchangetime');
    t.integer('ecompanylogchangeby');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ecompanylog');