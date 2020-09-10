exports.up = (knex, Promise) => knex.schema.createTable('ecompanycarouselmapping', t => {
    t.increments('ecompanycarouselmappingid').primary().unsigned();
    t.integer('efileefileid').notNullable().references('efile.efileid').onDelete('CASCADE');
    t.integer('ecompanyecompanyid').references('ecompany.ecompanyid').onDelete('CASCADE')
    t.integer('ecompanycarouselmappingcreateby').notNullable()
    t.bigInteger('ecompanycarouselmappingcreatetime').notNullable().defaultTo(Date.now())
    t.integer('ecompanycarouselmappingchangeby');
    t.bigInteger('ecompanycarouselmappingchangetime');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('ecompanycarouselmapping');