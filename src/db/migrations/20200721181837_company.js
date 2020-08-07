exports.up = (knex, Promise) => knex.schema.createTable('ecompany', t => {
    t.increments('ecompanyid').primary().unsigned();
    t.string('ecompanyname').notNullable();
    t.string('ecompanyemailaddress');
    t.binary('ecompanylogo');
    t.integer('ecompanypremiumstatus').notNullable().defaultTo(1);
    t.integer('ecompanycreateby').notNullable().defaultTo(0);
    t.bigInteger('ecompanycreatedate', true).notNullable().defaultTo(Date.now());
    t.integer('ecompanyeditby');
    t.bigInteger('ecompanyedittime', true);
    t.integer('ecompanydeleteby');
    t.bigInteger('ecompanydeletetime', true);
    t.boolean('ecompanydeletestatus').notNullable().defaultTo(false);
    t.integer('ecompanytablestatus').notNullable().defaultTo(1);
    t.integer('eaddresseaddressid').notNullable().references('eaddress.eaddressid');
    t.integer('ecompanyparentid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('ecompany');