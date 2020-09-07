exports.up = (knex, Promise) => knex.schema.createTable('ecompany', t => {
    t.increments('ecompanyid').primary().unsigned();
    t.string('ecompanyname').notNullable();
    t.string('ecompanyemailaddress');
    t.binary('ecompanylogo');
    t.string('ecompanynik');
    t.boolean('ecompanyautonik').defaultTo(false);
    t.string('ecompanyphonenumber');
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
    t.integer('efileefileid').references('efile.efileid').onDelete('SET NULL');
    t.integer('eindustryeindustryid').references('eindustry.eindustryid').onDelete('SET NULL')
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('ecompany');