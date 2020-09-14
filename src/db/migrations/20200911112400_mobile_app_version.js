exports.up = (knex, Promise) => knex.schema.createTable('emobileappversion', t => {
    t.increments('emobileappversionid').primary().unsigned();
    t.boolean('emobileappversionforceupdate')
    t.string('emobileappversion')
    t.bigInteger('emobileappversionchangetime')
    t.string('emobileappversionstatus')
});

exports.down = (knex, Promise) => knex.schema.dropTable('emobileappversion');