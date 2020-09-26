exports.up = (knex, Promise) => knex.schema.table('ecompanyusermapping', t => {
    t.integer('ecompanyusermappingpermission').defaultTo(1).alter();
});

exports.down = (knex, Promise) => knex.schema.table('ecompanyusermapping', t => {
    t.integer('ecompanyusermappingpermission').notNullable().defaultTo(1).alter()
});