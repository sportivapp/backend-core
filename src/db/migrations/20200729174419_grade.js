exports.up = (knex, Promise) => knex.schema.createTable('egrade', t => {
    t.increments('egradeid').primary().unsigned();
    t.string('egradename', 256).notNullable();
    t.integer('egradecreateby').notNullable();
    t.string('egradedescription', 256);
    t.bigInteger('egradecreatetime', false).notNullable().defaultTo(Date.now());
    t.integer('egradeeditby');
    t.bigInteger('egradeedittime', false);
    t.integer('egradedeleteby');
    t.bigInteger('egradedeletetime', false);
    t.boolean('egradedeletestatus').defaultTo(false);
    t.integer('egradetablestatus').notNullable().defaultTo(1);
    t.integer('ecompanycompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE');
    t.integer('egradesuperiorid').references('egrade.egradeid').onDelete('SET NULL');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('egrade');