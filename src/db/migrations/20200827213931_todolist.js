exports.up = (knex, Promise) => knex.schema.createTable('etodo', t => {
    t.increments('etodoid').primary().unsigned()
    t.integer('eprojecteprojectid').references('eproject.eprojectid').onDelete('CASCADE');
    t.integer('eshifttimeeshifttimeid').references('eshifttime.eshifttimeid').onDelete('CASCADE');
    t.integer('efileefileid').references('efile.efileid').onDelete('SET NULL');
    t.string('etodoname').notNullable();
    t.bigInteger('etodostarttime').defaultTo(Date.now());
    t.bigInteger('etodoendtime').defaultTo(Date.now());
    t.string('etodoaddress')
    t.string('etododescription')
    t.integer('etodocreateby').notNullable();
    t.bigInteger('etodocreatetime').notNullable().defaultTo(Date.now());
    t.integer('etodochangeby');
    t.bigInteger('etodochangetime');
    t.integer('etododeleteby');
    t.boolean('etododeletestatus').defaultTo(false);
    t.bigInteger('etododeletetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('etodo');