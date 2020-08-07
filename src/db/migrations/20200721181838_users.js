exports.up = (knex, Promise) => knex.schema.createTable('euser', t => {
    t.increments('euserid').primary().unsigned();
    t.integer('euserpermission').notNullable().defaultTo(1);
    t.integer('euseruserstatus').notNullable().defaultTo(1);
    t.string('eusernik');
    t.bigInteger('euserlastlogout', true);
    t.string('eusername', 256).notNullable();
    t.string('euseremail', 256).notNullable();
    t.string('euserpassword', 256).notNullable();
    t.string('eusermobilenumber', 256).notNullable();
    t.bigInteger('euseractivationtime', true).defaultTo(Date.now());
    t.bigInteger('euserlastlogin', true).defaultTo(Date.now());
    t.integer('eusercreateby').notNullable().defaultTo(0);
    t.bigInteger('eusercreatetime', true).notNullable().defaultTo(Date.now());
    t.integer('euserdeleteby');
    t.boolean('euserdeletestatus').defaultTo(false);
    t.bigInteger('euserdeletetime', true);
    t.integer('eusereditby');
    t.bigInteger('euseredittime', true);
    t.integer('eusertablestatus').notNullable().defaultTo(1);
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('euser');