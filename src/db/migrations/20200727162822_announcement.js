exports.up = (knex, Promise) => knex.schema.createTable('eannouncement', t => {
    t.increments('eannouncementid').primary().unsigned();
    t.string('eannouncementtitle', 256).notNullable();
    t.string('eannouncementcontent', 4097).notNullable();
    t.integer('eannouncementcreateby').notNullable();
    t.timestamp('eannouncementcreatedate', false).notNullable().defaultTo(knex.fn.now());
    t.integer('eannouncementeditby');
    t.timestamp('eannouncementedittime', false);
    t.integer('eannouncementdeleteby');
    t.timestamp('eannouncementdeletetime', false);
    t.integer('eannouncementdeletestatus').defaultTo(0);
    t.integer('eannouncementtablestatus').notNullable().defaultTo(1);
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eannouncement');