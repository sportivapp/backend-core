exports.up = (knex, Promise) => knex.schema.alterTable('enews', t => {
    t.integer('eindustryeindustryid').notNullable().defaultTo(1).references('eindustry.eindustryid').onDelete('CASCADE');
    t.bigInteger('enewsdate').nullable().alter();
    t.boolean('enewsispublic').defaultTo(false);
});

exports.down = (knex, Promise) => knex.schema.alterTable('enews', t => {
    t.dropForeign('eindustryeindustryid');
    t.dropColumn('eindustryeindustryid');
    t.bigInteger('enewsdate').notNullable().alter();
    t.dropColumn('enewsispublic');
});