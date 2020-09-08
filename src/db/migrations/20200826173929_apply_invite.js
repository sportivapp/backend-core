exports.up = (knex, Promise) => knex.schema.createTable('eapplyinvite', t => {

});

exports.down = (knex, Promise) => knex.schema.dropTable('eapplyinvite');