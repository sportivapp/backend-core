exports.up = (knex, Promise) => knex.schema.alterTable('ecompanyusermapping', t => {
    t.dropColumn('ecompanyusermappingpermission');
});

exports.down = (knex, Promise) => knex.schema.alterTable('ecompanyusermapping', t => {
    t.integer('ecompanyusermappingpermission').notNullable().defaultTo(1);
});