
exports.up = (knex) => knex.schema.createTable('epermit', t => {
    t.increments('epermitid').primary().unsigned();
    t.integer('epermitstatus').notNullable();
    t.string('epermitdescription').notNullable();
    t.date('epermitstartdate', true).notNullable();
    t.date('epermitenddate', true).notNullable();
    t.integer('epermitcreateby').notNullable();
    t.timestamp('epermitcreatetime', true).notNullable().defaultTo(knex.fn.now());
    t.integer('epermitchangeby');
    t.timestamp('epermitchangetime', true);
    t.integer('epermittablestatus').notNullable().defaultTo(1);
    t.integer('euseruserid').references('euser.euserid').onDelete('CASCADE');
})

exports.down = (knex) => knex.schema.dropTable('epermit')
