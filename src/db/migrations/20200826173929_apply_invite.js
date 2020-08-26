exports.up = (knex, Promise) => knex.schema.createTable('eapplyinvite', t => {
    t.increments('eapplyinviteid').primary().unsigned();
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE');
    t.string('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE');
    t.string('eapplyinvitemessage');
    t.enum('eapplyinvitestatus', ['ACCEPTED', 'REJECTED']).defaultTo('PENDING');
    t.bigInteger('eapplyinvitecreatetime').notNullable();
    t.integer('eapplyinvitecreateby').notNullable();
});

exports.down = (knex, Promise) => knex.schema.dropTable('eapplyinvite');