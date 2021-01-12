exports.up = (knex, Promise) => knex.schema.createTable('ebanner', t => {
    t.increments('ebannerid').primary().unsigned();
    t.bigInteger('ebannerstarttime');
    t.bigInteger('ebannerendtime');
    t.enum('ebannerstatus', ['INACTIVE', 'ACTIVE']).defaultTo('INACTIVE');
    t.bigInteger('ebannercreatetime').notNullable();
    t.integer('ebannercreateby').notNullable();
    t.bigInteger('ebannerchangetime');
    t.integer('ebannerchangeby');
    t.integer('efileefileid').references('efile.efileid').notNullable();
});

exports.down = (knex, Promise) => knex.schema.dropTable('ebanner');