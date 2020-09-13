exports.up = (knex, Promise) => knex.schema.createTable('elicense', t => {
    t.increments('elicenseid').primary().unsigned();
    t.string('elicenseacademicname').notNullable();
    t.bigInteger('elicensegraduationdate').notNullable();
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE');
    t.integer('elicenselevelelicenselevelid').notNullable().references('elicenselevel.elicenselevelid').onDelete('CASCADE');
    t.string('elicenseadditionalinformation');
    t.integer('efileefileid').notNullable().references('efile.efileid').onDelete('CASCADE');
    t.integer('elicensecreateby').notNullable();
    t.bigInteger('elicensecreatetime').notNullable();
    t.integer('elicensechangeby');
    t.bigInteger('elicensechangetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('elicense');