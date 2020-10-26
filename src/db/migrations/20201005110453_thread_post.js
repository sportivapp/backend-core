exports.up = (knex, Promise) => knex.schema.createTable('ethreadpost', t => {
    t.increments('ethreadpostid').primary().unsigned();
    t.string('ethreadpostcomment', 500).notNullable();
    t.integer('ethreadethreadid').notNullable().references('ethread.ethreadid').onDelete('CASCADE');
    t.integer('efileefileid').references('efile.efileid').onDelete('SET NULL');
    t.bigInteger('ethreadpostcreatetime').notNullable();
    t.integer('ethreadpostcreateby').notNullable();
    t.bigInteger('ethreadpostchangetime');
    t.integer('ethreadpostchangeby');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ethreadpost');