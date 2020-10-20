exports.up = (knex, Promise) => knex.schema.alterTable('eteam', t => {
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE');
    t.boolean('eteamispublic').notNullable().defaultTo(false);
});

exports.down = (knex, Promise) => knex.schema.alterTable('eteam', t => {
    t.dropColumn('eindustryeindustryid');
    t.dropColumn('eteamispublic');
});