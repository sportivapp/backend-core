exports.up = (knex, Promise) => knex.schema.createTable('ethreadpostreply', t => {
    t.increments('ethreadpostreplyid').primary().unsigned();
    t.integer('ethreadethreadid').notNullable().references('ethread.ethreadid').onDelete('CASCADE');
    t.integer('ethreadpostethreadpostid').notNullable().references('ethreadpost.ethreadpostid').onDelete('CASCADE');
    t.string('ethreadpostreplycomment', 500).notNullable();
    t.integer('efileefileid').references('efile.efileid').onDelete('SET NULL');
    t.bigInteger('ethreadpostreplycreatetime').notNullable();
    t.integer('ethreadpostreplycreateby').notNullable();
    t.bigInteger('ethreadpostreplychangetime');
    t.integer('ethreadpostreplychangeby');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ethreadpostreply');