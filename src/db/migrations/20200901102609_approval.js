exports.up = (knex, Promise) => knex.schema.createTable('eapproval', t => {
    t.increments('eapprovalid').unsigned().primary()
    t.integer('edepartmentedepartmentid').references('edepartment.edepartmentid')
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid')
    t.integer('etargetuserid').references('euser.euserid')
    t.enum('eapprovaltype', ['MULTI', 'SINGLE']).notNullable()
    t.bigInteger('eapprovalcreatetime').notNullable()
    t.integer('eapprovalcreateby').notNullable()
    t.integer('eapprovalchangeby');
    t.bigInteger('eapprovalchangetime');
    t.bigInteger('eapprovaldeletetime')
    t.boolean('eapprovaldeletestatus').defaultTo(false);
    t.integer('eapprovaldeleteby')
});

exports.down = (knex, Promise) => knex.schema.dropTable('eapproval');