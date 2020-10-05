exports.up = (knex, Promise) => knex.schema.createTable('ethread', t => {
    t.increments('ethreadid').primary().unsigned();
    t.string('ethreadtitle').unique().notNullable();
    t.string('ethreaddescription', 1025);
    t.boolean('ethreadlock').notNullable().defaultTo(false);
    t.string('ethreadtype').notNullable();
    t.boolean('ethreadispublic').notNullable();
    t.integer('ecompanyecompanyid').references('ecompany.ecompanyid').onDelete('CASCADE');
    t.integer('eteameteamid').references('eteam.eteamid').onDelete('CASCADE');
    t.bigInteger('ethreadcreatetime').notNullable();
    t.integer('ethreadcreateby').notNullable();
    t.bigInteger('ethreadchangetime');
    t.integer('ethreadchangeby');
});

exports.down = (knex, Promise) => knex.schema.dropTable('ethread');