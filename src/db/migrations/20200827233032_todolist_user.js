exports.up = (knex, Promise) => knex.schema.createTable('etodouser', t => {
    t.increments('etodouserid').primary().unsigned()
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE');
    t.integer('etodoetodoid').notNullable().references('etodo.etodoid').onDelete('CASCADE');
    t.integer('etodolistcategoryetodolistcategoryid').references('etodolistcategory.etodolistcategoryid').onDelete('SET NULL');
    t.integer('etodousercreateby').notNullable();
    t.enum('etodouserstatus', ['PENDING', 'APPROVED', 'REJECTED', 'STARTED', 'ENDED', 'CANCELED']).notNullable()
    t.bigInteger('etodousercreatetime').notNullable().defaultTo(Date.now());
    t.integer('etodouserchangeby');
    t.bigInteger('etodouserchangetime');
    t.integer('etodouserdeleteby');
    t.boolean('etodouserdeletestatus').defaultTo(false);
    t.bigInteger('etodouserdeletetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('etodouser');