exports.up = (knex, Promise) => knex.schema.alterTable('euser', t => {
    t.dropForeign('euserapprovaluserid1', 'euser_euserapprovaluserid1_foreign')
    t.dropColumn('euserapprovaluserid1')
    t.dropForeign('euserapprovaluserid2', 'euser_euserapprovaluserid2_foreign')
    t.dropColumn('euserapprovaluserid2')
    t.dropForeign('euserapprovaluserid3', 'euser_euserapprovaluserid3_foreign')
    t.dropColumn('euserapprovaluserid3')
    t.dropColumn('eusermultiapproval');
});

exports.down = (knex, Promise) => knex.schema.alterTable('euser', t => {
    t.integer('euserapprovaluserid1').references('euser.euserid');
    t.integer('euserapprovaluserid2').references('euser.euserid');
    t.integer('euserapprovaluserid3').references('euser.euserid');
    t.boolean('eusermultiapproval').notNullable().defaultTo(false);
});