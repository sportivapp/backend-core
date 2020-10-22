exports.up = (knex, Promise) => knex.schema.createTable('ecompanydefaultposition', t => {
    t.increments('ecompanydefaultpositionid').primary().unsigned();
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE');
    t.integer('eadmingradeid').notNullable().references('egrade.egradeid')
    t.integer('emembergradeid').notNullable().references('egrade.egradeid')
    t.integer('ecompanydefaultpositioncreateby').notNullable();
    t.bigInteger('ecompanydefaultpositioncreatetime').notNullable().defaultTo(Date.now());
    t.integer('ecompanydefaultpositionchangeby');
    t.bigInteger('ecompanydefaultpositionchangetime');

  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('ecompanydefaultposition');