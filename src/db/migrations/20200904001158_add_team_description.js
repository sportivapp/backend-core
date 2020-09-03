exports.up = (knex, Promise) => knex.schema.alterTable('eteam', t => {
    t.string('eteamdescription');
});

exports.down = (knex, Promise) => knex.schema.alterTable('eteam', t => {
    t.dropColumn('eteamdescription')
});