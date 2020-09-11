exports.up = (knex, Promise) => knex.schema.createTable('eclass', t => {
    t.increments('eclassid').primary().unsigned();
    t.string('eclassname').notNullable();
    t.bigInteger('eclassstartdate').notNullable();
    t.bigInteger('eclassenddate').notNullable();
    t.integer('eclassstarthour').notNullable().defaultTo(0);
    t.integer('eclassstartminute').notNullable().defaultTo(0);
    t.integer('eclassendhour').notNullable().defaultTo(23);
    t.integer('eclassendminute').notNullable().defaultTo(59);
    t.string('eclassdescription');
    t.string('eclassaddress');
    t.enum('eclasstype', ['PUBLIC', 'PRIVATE']);
    t.integer('eclassprice').notNullable();
    t.string('eclasspicname')
    t.string('eclasspicmobilenumber')
    t.integer('eclasscreateby').notNullable();
    t.bigInteger('eclasscreatetime').notNullable().defaultTo(Date.now());
    t.integer('eclasschangeby');
    t.bigInteger('eclasschangetime');
    t.boolean('eclassdeletestatus').defaultTo(false);
    t.integer('eclasstablestatus').notNullable().defaultTo(1);
    t.integer('efileefileid').notNullable().references('efile.efileid').onDelete('SET NULL')
    t.integer('ecompanyecompanyid').notNullable().references('ecompany.ecompanyid').onDelete('CASCADE')
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE')
});

exports.down = (knex, Promise) => knex.schema.dropTable('eclass');