exports.up = (knex, Promise) => knex.schema.table('elicense', t => {
    t.dropColumn('elicenselevel');
    t.integer('elicenselevelelicenselevelid').notNullable().defaultTo(8).references('elicenselevel.elicenselevelid').onDelete('CASCADE');
    // t.integer('elicenselevel').notNullable().defaultTo(8).references('elicenselevel.elicenselevelid').onDelete('CASCADE').alter();
    // t.renameColumn('elicenselevel', 'elicenselevelelicenselevelid')
});

exports.down = (knex, Promise) => knex.schema.table('elicense', t => {
    t.dropColumn('elicenselevelelicenselevelid')
});