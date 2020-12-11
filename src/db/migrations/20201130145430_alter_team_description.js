exports.up = (knex, Promise) => knex.schema.alterTable('eteam', t => {
    t.string('eteamdescription', 1000).alter();
});

exports.down = (knex, Promise) => knex.schema.alterTable('eteam', t => {
    t.string('eteamdescription', 255).alter();
});