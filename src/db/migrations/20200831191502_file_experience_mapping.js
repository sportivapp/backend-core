exports.up = (knex, Promise) => knex.schema.createTable('efileexperiencemapping', t => {
    t.increments('efileexperiencemappingid').primary().unsigned();
    t.integer('efileefileid').notNullable().references('efile.efileid').onDelete('CASCADE');
    t.integer('eexperienceeexperienceid').references('eexperience.eexperienceid').onDelete('CASCADE')
    t.integer('efileexperiencemappingcreateby').notNullable()
    t.bigInteger('efileexperiencemappingcreatetime').notNullable().defaultTo(Date.now())
    t.integer('efileexperiencemappingchangeby');
    t.bigInteger('efileexperiencemappingchangetime');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('efileexperiencemapping');