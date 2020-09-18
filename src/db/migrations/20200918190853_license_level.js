exports.up = (knex, Promise) => knex.schema.createTable('elicenselevel', t => {
    t.increments('elicenselevelid').primary().unsigned();
    t.string('elicenselevelname').notNullable();
    t.integer('elicenselevelcreateby').notNullable();
    t.bigInteger('elicenselevelcreatetime').notNullable().defaultTo(Date.now());
    t.integer('elicenselevelchangeby');
    t.bigInteger('elicenselevelchangetime');
    t.boolean('elicenseleveldeletestatus').defaultTo(false);
    t.integer('elicenseleveltablestatus').notNullable().defaultTo(1);
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('CASCADE');
});

exports.down = (knex, Promise) => knex.schema.dropTable('elicenselevel');