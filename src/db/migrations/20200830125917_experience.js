exports.up = (knex, Promise) => knex.schema.createTable('eexperience', t => {
    t.increments('eexperienceid').primary().unsigned();
    t.string('eexperiencename', 65).notNullable();
    t.bigInteger('eexperiencestartdate').notNullable();
    t.bigInteger('eexperienceenddate');
    t.string('eexperiencelocation', 65);
    t.string('eexperienceposition', 65);
    t.string('eexperiencedescription', 1025);
    t.integer('eexperiencecreateby').notNullable();
    t.bigInteger('eexperiencecreatetime').notNullable().defaultTo(Date.now());
    t.integer('eexperiencechangeby');
    t.bigInteger('eexperiencechangetime');
    t.boolean('eexperiencedeletestatus').defaultTo(false);
    t.integer('eexperiencetablestatus').notNullable().defaultTo(1);
    t.integer('eusereuserid').notNullable().references('euser.euserid').onDelete('CASCADE');
    t.integer('eindustryeindustryid').notNullable().references('eindustry.eindustryid').onDelete('SET NULL')
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('eexperience');