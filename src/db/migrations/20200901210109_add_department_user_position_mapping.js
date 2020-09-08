exports.up = (knex, Promise) => knex.schema.alterTable('euserpositionmapping', t => {
    t.integer('edepartmentedepartmentid').references('euser.euserid').onDelete('CASCADE')
});

exports.down = (knex, Promise) => knex.schema.alterTable('euserpositionmapping', t => {
    t.dropForeign('edepartmentedepartmentid', 'euserpositionmapping_edepartmentedepartmentid_foreign')
    t.dropColumn('edepartmentedepartmentid')
});