exports.up = (knex, Promise) => knex.schema.createTable('etimesheet', t => {
    t.increments('etimesheetid').primary().unsigned();
    t.string('etimesheetname').notNullable();
    t.integer('etimesheetcreateby').notNullable();
    t.bigInteger('etimesheetcreatetime').notNullable();
    t.integer('etimesheetchangeby');
    t.bigInteger('etimesheetchangetime');
    t.integer('etimesheetrostercount')
    t.integer('eshifteshiftid').references('eshift.eshiftid').onDelete('CASCADE')
});

exports.down = (knex, Promise) => knex.schema.dropTable('etimesheet');