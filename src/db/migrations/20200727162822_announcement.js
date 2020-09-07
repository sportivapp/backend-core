exports.up = (knex, Promise) => knex.schema.createTable('eannouncement', t => {
    t.increments('eannouncementid').primary().unsigned();
    t.string('eannouncementtitle', 256).notNullable();
    t.string('eannouncementcontent', 4097).notNullable();
    t.integer('efileefileid').references('efile.efileid').onDelete('SET NULL');
    t.integer('ecompanyecompanyid').references('ecompany.ecompanyid').onDelete('CASCADE');
    t.integer('eannouncementcreateby').notNullable();
    t.bigInteger('eannouncementcreatetime').notNullable().defaultTo(Date.now());
    t.integer('eannouncementchangeby');
    t.bigInteger('eannouncementchangetime');
    t.integer('eannouncementdeleteby');
    t.boolean('eannouncementdeletestatus').defaultTo(false);
    t.bigInteger('eannouncementdeletetime');
    t.integer('eannouncementtablestatus').notNullable().defaultTo(1);
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eannouncement');