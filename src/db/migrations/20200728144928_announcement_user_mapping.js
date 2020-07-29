exports.up = (knex, Promise) => knex.schema.createTable('eannouncementusermapping', t => {
    t.integer('eannouncementeannouncementid').notNullable().references('eannouncement.eannouncementid');
    t.integer('eusereuserid').notNullable().references('euser.euserid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eannouncementusermapping');