exports.up = (knex, Promise) => knex.schema.createTable('ecompanyfilemapping', t => {
    t.increments('ecompanyfilemappingid').primary().unsigned();
    t.integer('ecompanyecompanyid').references('ecompany.ecompanyid').onDelete('CASCADE')
    t.integer('efileefileid').notNullable().references('efile.efileid').onDelete('CASCADE');
    t.integer('ecompanyfilemappingcreateby').notNullable()
    t.bigInteger('ecompanyfilemappingcreatetime').notNullable().defaultTo(Date.now())
    t.integer('ecompanyfilemappingchangeby');
    t.bigInteger('ecompanyfilemappingchangetime');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('ecompanyfilemapping');