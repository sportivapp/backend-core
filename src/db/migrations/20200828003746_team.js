exports.up = (knex, Promise) => knex.schema.createTable('eteam', t => {
    t.increments('eteamid').primary().unsigned();
    t.integer('ecompanyecompanyid').references('ecompany.ecompanyid').onDelete('CASCADE');
    t.integer('efileefileid').references('efile.efileid').onDelete('SET NULL');
    t.string('eteamname').notNullable();
    t.string('eteamdescription');
    t.bigInteger('eteamcreatetime').notNullable();
    t.integer('eteamcreateby').notNullable();
    t.bigInteger('eteamchangetime');
    t.integer('eteamchangeby');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eteam');