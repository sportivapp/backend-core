exports.up = (knex, Promise) => knex.schema.createTable('efile', t => {
    t.increments('efileid').primary().unsigned();
    t.string('efilename').notNullable();
    t.string('efilepath').notNullable();
    t.string('efiletype').notNullable();
    t.integer('efilecreateby').notNullable();
    t.bigInteger('efilecreatetime').notNullable();
    t.integer('efilechangeby').notNullable();
    t.bigInteger('efilechangetime').notNullable();
});
  
exports.down = (knex, Promise) => knex.schema.dropTable('efile');