exports.up = (knex, Promise) => knex.schema.createTable('eannouncementusermapping', t => {
    t.increments('eannouncementusermappingid').primary().unsigned();
    t.integer('eannouncementeannouncementid').notNullable().references('eannouncement.eannouncementid').onDelete('CASCADE');
    t.integer('eusereuserid').notNullable().references('euser.euserid');
    t.integer('eannouncementusermappingcreateby').notNullable().defaultTo(0);
    t.bigInteger('eannouncementusermappingcreatetime').notNullable().defaultTo(Date.now());
    t.integer('eannouncementusermappingchangeby');
    t.bigInteger('eannouncementusermappingchangetime');
    t.integer('eannouncementusermappingdeleteby');
    t.boolean('eannouncementusermappingdeletestatus').defaultTo(false);
    t.bigInteger('eannouncementusermappingdeletetime');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eannouncementusermapping');