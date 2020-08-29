exports.up = (knex, Promise) => knex.schema.createTable('etodolistcategory', t => {
    t.increments('etodolistcategoryid').primary().unsigned()
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE');
    t.string('etodolistcategoryname').notNullable();
    t.integer('etodolistcategorycreateby').notNullable();
    t.bigInteger('etodolistcategorycreatetime').notNullable().defaultTo(Date.now());
    t.integer('etodolistcategorychangeby');
    t.bigInteger('etodolistcategorychangetime');
    t.integer('etodolistcategorydeleteby');
    t.boolean('etodolistcategorydeletestatus').defaultTo(false);
    t.bigInteger('etodolistcategorydeletetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('etodolistcategory');