exports.up = (knex, Promise) => knex.schema.createTable('euser', t => {
    t.increments('euserid').primary().unsigned();
    t.integer('euserpermission').notNullable().defaultTo(1);
    t.integer('euseruserstatus').notNullable().defaultTo(1);
    t.integer('eusernik');
    t.timestamp('euserlastlogout', true);
    t.string('eusername', 256).notNullable();
    t.string('euseremail', 256).notNullable();
    t.string('euserpassword', 256).notNullable();
    t.string('eusermobilenumber', 256).notNullable();
    t.timestamp('euseractivationtime', true).defaultTo(knex.fn.now());
    t.timestamp('euserlastlogin', true).defaultTo(knex.fn.now());
    t.integer('eusercreateby').notNullable().defaultTo(0);
    t.timestamp('eusercreatetime', true).notNullable().defaultTo(knex.fn.now());
    t.integer('euserdeleteby');
    t.integer('euserdeletestatus');
    t.timestamp('euserdeletetime', true);
    t.integer('eusereditby');
    t.timestamp('euseredittime', true);
    t.integer('eusertablestatus').notNullable().defaultTo(1);
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('euser');