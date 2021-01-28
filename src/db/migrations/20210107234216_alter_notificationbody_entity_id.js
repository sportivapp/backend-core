exports.up = (knex, Promise) => knex.schema.alterTable('enotificationbody', t => {
    t.string('enotificationbodyentityid').alter();
});

exports.down = (knex, Promise) => knex.schema.alterTable('enotificationbody', t => {
    t.integer('enotificationbodyentityid').alter();
});