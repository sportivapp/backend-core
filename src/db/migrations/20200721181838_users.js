const { uniqueId } = require("lodash");

exports.up = (knex, Promise) => knex.schema.createTable('euser', t => {
    t.increments('euserid').primary().unsigned();
    t.integer('euseruserstatus').notNullable().defaultTo(1);
    t.string('eusernik');
    t.bigInteger('euserlastlogout');
    t.string('eusername', 256).notNullable();
    t.string('euseridentitynumber', 17);
    t.string('euseremail', 256).unique().notNullable();
    t.string('euserpassword', 256).notNullable();
    t.string('eusermobilenumber', 256).notNullable();
    t.bigInteger('euserdob');
    t.string('eusergender');
    t.string('euserhobby');
    t.string('euseraddress');
    t.integer('ecountryecountryid').references('ecountry.ecountryid').onDelete('SET NULL');
    t.integer('efileefileid').references('efile.efileid').onDelete('SET NULL');
    t.string('euserfacebook');
    t.string('euserinstagram');
    t.string('euserlinkedin');
    t.bigInteger('euseractivationtime').defaultTo(Date.now());
    t.bigInteger('euserlastlogin').defaultTo(Date.now());
    t.integer('eusercreateby').notNullable().defaultTo(0);
    t.bigInteger('eusercreatetime').notNullable().defaultTo(Date.now());
    t.integer('euserdeleteby');
    t.boolean('euserdeletestatus').defaultTo(false);
    t.bigInteger('euserdeletetime');
    t.integer('euserchangeby');
    t.bigInteger('euserchangetime');
    t.integer('eusertablestatus').notNullable().defaultTo(1);
    t.integer('euserapprovaluserid1').references('euser.euserid');
    t.integer('euserapprovaluserid2').references('euser.euserid');
    t.integer('euserapprovaluserid3').references('euser.euserid');
    t.boolean('eusermultiapproval').notNullable().defaultTo(false);
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('euser');