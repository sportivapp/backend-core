exports.up = (knex, Promise) => knex.schema.createTable('erosterschedule', t => {
    t.increments('erosterscheduleid').primary().unsigned();
    t.string('erosterschedulename', 256).notNullable();
    t.string('erosterscheduledescription', 256);
    t.date('erosterscheduledate').notNullable();
    t.integer('erosterschedulecreateby').notNullable().defaultTo(0);
    t.bigInteger('erosterschedulecreatetime').notNullable().defaultTo(Date.now());
    t.integer('erosterschedulechangeby');
    t.bigInteger('erosterschedulechangetime');
    t.integer('erosterscheduledeleteby');
    t.boolean('erosterscheduledeletestatus').defaultTo(false);
    t.bigInteger('erosterscheduledeletetime');
    t.integer('erostershifterostershift').notNullable().references('erostershift.erostershiftid');
  });
  
  exports.down = (knex, Promise) => knex.schema.dropTable('erosterschedule');