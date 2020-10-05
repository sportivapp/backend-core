exports.up = (knex, Promise) => knex.schema.createTable('enews', t => {
    t.increments('enewsid').primary().unsigned();
    t.bigInteger('enewsdate').notNullable();
    t.string('enewstitle').notNullable();
    t.text('enewscontent').notNullable();
    t.integer('enewscreateby').notNullable();
    t.bigInteger('enewscreatetime').notNullable().defaultTo(Date.now());
    t.integer('enewschangeby');
    t.bigInteger('enewschangetime');
    t.boolean('enewsdeletestatus').defaultTo(false);
    t.integer('enewstablestatus').notNullable().defaultTo(1);
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE');
    t.integer('efileefileid').references('efile.efileid').onDelete('SET NULL');
    t.boolean('enewsispublished').defaultTo(false);

});

exports.down = (knex, Promise) => knex.schema.dropTable('enews');