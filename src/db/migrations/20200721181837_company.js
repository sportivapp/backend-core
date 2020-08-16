exports.up = (knex, Promise) => knex.schema.createTable('ecompany', t => {
    t.increments('ecompanyid').primary().unsigned();
    t.string('ecompanyname').notNullable();
    t.string('ecompanyemailaddress');
    t.binary('ecompanylogo');
    t.integer('ecompanypremiumstatus').notNullable().defaultTo(1);
    t.integer('ecompanycreateby').notNullable();
    t.bigInteger('ecompanycreatetime').notNullable()
    t.integer('ecompanychangeby');
    t.bigInteger('ecompanychangetime');
    t.integer('ecompanydeleteby');
    t.bigInteger('ecompanydeletetime');
    t.boolean('ecompanydeletestatus').defaultTo(false);
    t.integer('ecompanytablestatus').notNullable().defaultTo(1);
    t.integer('eaddresseaddressid').notNullable().references('eaddress.eaddressid');
    t.integer('ecompanyparentid').references('ecompany.ecompanyid').onDelete('CASCADE')
    t.integer('ecompanyolderid').references('ecompany.ecompanyid').onDelete('SET NULL')
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('ecompany');