exports.up = (knex, Promise) => knex.schema.createTable('eapprovaluser', t => {
    t.increments('eapprovaluserid').unsigned().primary()
    t.integer('eapprovaleapprovalid').references('eapproval.eapprovalid')
    t.integer('eusereuserid').notNullable().references('euser.euserid')
    t.bigInteger('eapprovalusercreatetime').notNullable()
    t.integer('eapprovalusercreateby').notNullable()
    t.integer('eapprovaluserchangeby');
    t.bigInteger('eapprovaluserchangetime');
    t.bigInteger('eapprovaluserdeletetime')
    t.boolean('eapprovaluserdeletestatus').defaultTo(false);
    t.integer('eapprovaluserdeleteby')
});

exports.down = (knex, Promise) => knex.schema.dropTable('eapprovaluser');