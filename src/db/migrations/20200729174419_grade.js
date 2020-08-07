exports.up = (knex, Promise) => knex.schema.createTable('egrade', t => {
    t.increments('egradeid').primary().unsigned();
    t.string('egradename', 256).notNullable();
    t.string('egradedescription', 256);
    t.integer('egradecreateby').notNullable();
    t.bigInteger('egradecreatetime').notNullable().defaultTo(Date.now());
    t.integer('egradechangeby');
    t.bigInteger('egradechangetime');
    t.integer('egradedeleteby');
    t.boolean('egradedeletestatus').defaultTo(false);
    t.bigInteger('egradedeletetime');
    t.integer('egradetablestatus').notNullable().defaultTo(1);
    t.integer('ecompanycompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE');
    t.integer('egradesuperiorid').references('egrade.egradeid').onDelete('SET NULL');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('egrade');