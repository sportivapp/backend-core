exports.up = (knex, Promise) => knex.schema.createTable('ecompany', t => {
    t.increments('ecompanyid').primary().unsigned();
    t.string('ecompanyname').notNullable();
    t.string('ecompanyemailaddress');
    t.binary('ecompanylogo');
    t.integer('ecompanypremiumstatus').notNullable().defaultTo(1);
    t.integer('ecompanycreateby').notNullable().defaultTo(0);
    t.timestamp('ecompanycreatedate', true).notNullable().defaultTo(knex.fn.now());
    t.integer('ecompanyeditby');
    t.timestamp('ecompanyedittime', true);
    t.integer('ecompanydeleteby');
    t.timestamp('ecompanydeletetime', true);
    t.integer('ecompanydeletestatus');
    t.integer('ecompanytablestatus').notNullable().defaultTo(1);
    t.integer('eaddressesmastereaddressesmasterid').notNullable().references('eaddressesmaster.eaddressesmasterid');
    t.integer('ecompanyparentid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('ecompany');