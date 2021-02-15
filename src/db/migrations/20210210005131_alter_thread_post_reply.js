exports.up = (knex, Promise) => knex.schema.alterTable('ethreadpostreply', t => {
    t.integer('ethreadpostreplyethreadpostreplyid');
});

exports.down = (knex, Promise) => knex.schema.alterTable('ethreadpostreply', t => {
    t.dropColumn('ethreadpostreplyethreadpostreplyid');
});