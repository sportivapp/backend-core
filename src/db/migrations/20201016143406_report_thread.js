exports.up = (knex, Promise) => knex.schema.createTable('ereportthread', t => {
    t.increments('ereportthreadid').notNullable().primary().unsigned()
    t.string('ereportthreadmessage').notNullable()
    t.boolean('ereportthreadsent').defaultTo(false)
    t.integer('ethreadethreadid').notNullable().references('ethread.ethreadid').onDelete('CASCADE')
    t.integer('ethreadpostethreadpostid').references('ethreadpost.ethreadpostid').onDelete('CASCADE')
    t.integer('ethreadpostreplyethreadpostreplyid').references('ethreadpostreply.ethreadpostreplyid').onDelete('CASCADE')
    t.bigInteger('ereportthreadcreatetime').notNullable()
    t.integer('ereportthreadcreateby').notNullable()
    t.integer('ereportthreadchangeby');
    t.bigInteger('ereportthreadchangetime');
    t.bigInteger('ereportthreaddeletetime')
    t.boolean('ereportthreaddeletestatus').defaultTo(false);
    t.integer('ereportthreaddeleteby')
});

exports.down = (knex, Promise) => knex.schema.dropTable('ereportthread');