exports.up = (knex, Promise) => knex.schema.createTable('eapplyinvite', t => {
    t.increments('eapplyinviteid').primary().unsigned();
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE');
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE');
    t.string('eapplyinvitemessage');
    t.enum('eapplyinvitetype', ['APPLY', 'INVITE']).notNullable();
    t.enum('eapplyinvitestatus', ['ACCEPTED', 'REJECTED', 'PENDING']).defaultTo('PENDING');
    t.bigInteger('eapplyinvitecreatetime').notNullable();
    t.integer('eapplyinvitecreateby').notNullable();
    t.bigInteger('eapplyinvitechangetime');
    t.integer('eapplyinvitechangeby');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eapplyinvite');