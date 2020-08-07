exports.up = (knex, Promise) => knex.schema.createTable('euser', t => {
    t.increments('euserid').primary().unsigned();
    t.integer('euserpermission').notNullable().defaultTo(1);
    t.integer('euseruserstatus').notNullable().defaultTo(1);
    t.string('eusernik');
    t.bigInteger('euserlastlogout');
    t.string('eusername', 256).notNullable();
    t.string('euseremail', 256).notNullable();
    t.string('euserpassword', 256).notNullable();
    t.string('eusermobilenumber', 256).notNullable();
    t.bigInteger('euseractivationtime').defaultTo(Date.now());
    t.bigInteger('euserlastlogin').defaultTo(Date.now());
    t.integer('eusercreateby').notNullable().defaultTo(0);
    t.bigInteger('eusercreatetime').notNullable().defaultTo(Date.now());
    t.integer('euserdeleteby');
    t.boolean('euserdeletestatus').defaultTo(false);
    t.bigInteger('euserdeletetime');
    t.integer('eusereditby');
    t.bigInteger('euseredittime');
    t.integer('eusertablestatus').notNullable().defaultTo(1);
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('euser');