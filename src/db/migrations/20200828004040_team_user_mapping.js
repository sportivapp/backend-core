exports.up = (knex, Promise) => knex.schema.createTable('eteamusermapping', t => {
    t.increments('eteamusermappingid').primary().unsigned();
    t.integer('eteameteamid').notNullable().references('eteam.eteamid').onDelete('CASCADE')
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE')
    t.enum('eteamusermappingposition', ['ADMIN', 'MEMBER']).notNullable().defaultTo('MEMBER');
    t.integer('eteamusermappingcreateby').notNullable();
    t.bigInteger('eteamusermappingcreatetime').notNullable();
    t.integer('eteamusermappingchangeby');
    t.bigInteger('eteamusermappingchangetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eteamusermapping');