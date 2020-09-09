exports.up = (knex) => knex.schema.alterTable('epermitapprovalmapping', t => {
    t.integer('eapprovaleapprovalid').references('eapproval.eapprovalid').onDelete('CASCADE');
})

exports.down = (knex) => knex.schema.alterTable('epermitapprovalmapping', t => {
    t.dropForeign('eapprovaleapprovalid', 'epermitapprovalmapping_eapprovaleapprovalid_foreign')
    t.dropColumn('eapprovaleapprovalid')
})
