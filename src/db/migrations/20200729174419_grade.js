exports.up = (knex, Promise) => knex.schema.createTable('egrade', t => {
    t.increments('egradeid').primary().unsigned();
    t.string('egradename', 256).notNullable();
    t.integer('egradecreateby').notNullable();
    t.string('egradedescription', 256);
    t.timestamp('egradecreatetime', false).notNullable().defaultTo(knex.fn.now());
    t.integer('egradeeditby');
    t.timestamp('egradeedittime', false);
    t.integer('egradedeleteby');
    t.timestamp('egradedeletetime', false);
    t.integer('egradedeletestatus').defaultTo(0);
    t.integer('egradetablestatus').notNullable().defaultTo(1);
    t.integer('ecompanycompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE');
    t.integer('egradesuperiorid').references('egrade.egradeid').onDelete('SET NULL');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('egrade');