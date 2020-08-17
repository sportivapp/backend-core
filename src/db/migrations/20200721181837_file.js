exports.up = (knex, Promise) => knex.schema.createTable('efile', t => {
    t.increments('efileid').primary().unsigned();
    t.string('efilename').notNullable();
    t.string('efilepath').notNullable();
    t.string('efiletype').notNullable();
    t.integer('efilecreateby').notNullable();
    t.bigInteger('efilecreatetime').notNullable();
});
  
exports.down = (knex, Promise) => knex.schema.dropTable('efile');