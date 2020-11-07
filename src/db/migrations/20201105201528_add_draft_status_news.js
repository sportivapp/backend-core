exports.up = (knex, Promise) => knex.schema.alterTable('enews', t => {
    t.integer('eindustryeindustryid').nullable().alter()
    t.string('enewstitle').nullable().alter();
    t.text('enewscontent').nullable().alter();
});

exports.down = (knex, Promise) => knex.schema.alterTable('enews', t => {
    t.integer('eindustryeindustryid').notNullable().alter();
    t.string('enewstitle').notNullable().alter();
    t.text('enewscontent').notNullable().alter();
});