exports.up = (knex, Promise) => knex.schema.createTable('egradefunctionmapping', t => {
    t.increments('egradefunctionmappingid').primary().unsigned();
    t.integer('egradeegradeid').notNullable().references('egrade.egradeid').onDelete('CASCADE')
    t.string('efunctionefunctioncode').notNullable().references('efunction.efunctioncode').onDelete('CASCADE')
});

exports.down = (knex, Promise) => knex.schema.dropTable('egradefunctionmapping');