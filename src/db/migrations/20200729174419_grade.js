exports.up = (knex, Promise) => knex.schema.createTable('egrade', t => {
    t.increments('egradeid').primary().unsigned();
    t.string('egrandename', 256).notNullable();
    t.integer('egradecreateby').notNullable();
    t.string('egradedescription', 256);
    t.timestamp('egradecreatetime', false).notNullable().defaultTo(knex.fn.now());
    t.integer('egradeeditby');
    t.timestamp('egradeedittime', false);
    t.integer('egradedeleteby');
    t.timestamp('egradedeletetime', false);
    t.integer('egradedeletestatus').defaultTo(0);
    t.integer('egradetablestatus').notNullable().defaultTo(1);
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('egrade');