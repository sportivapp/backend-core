exports.up = (knex, Promise) => knex.schema.createTable('eannouncement', t => {
    t.increments('eannouncementid').primary().unsigned();
    t.string('eannouncementtitle', 256).notNullable();
    t.string('eannouncementcontent', 4097).notNullable();
    t.integer('eannouncementcreateby').notNullable();
    t.bigInteger('eannouncementcreatedate', false).notNullable().defaultTo(Date.now());
    t.integer('eannouncementeditby');
    t.bigInteger('eannouncementedittime', false);
    t.integer('eannouncementdeleteby');
    t.bigInteger('eannouncementdeletetime', false);
    t.boolean('eannouncementdeletestatus').defaultTo(false);
    t.integer('eannouncementtablestatus').notNullable().defaultTo(1);
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eannouncement');