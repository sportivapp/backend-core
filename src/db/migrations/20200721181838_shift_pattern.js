exports.up = (knex, Promise) => knex.schema.createTable('eshiftpattern', t => {
    t.increments('eshiftpatternid').primary().unsigned();
    t.bigInteger('eshiftpatternstarttime').notNullable();
    t.bigInteger('eshiftpatternendtime').notNullable();
    t.integer('eshiftpatterncreateby').notNullable();
    t.bigInteger('eshiftpatterncreatetime').notNullable();
    t.integer('eshiftpatternchangeby');
    t.bigInteger('eshiftpatternchangetime');
    t.integer('eshifteshiftid').notNullable().references('eshift.eshiftid').onDelete('CASCADE');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eshiftpattern');