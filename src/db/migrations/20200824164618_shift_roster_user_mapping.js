exports.up = (knex, Promise) => knex.schema.createTable('eshiftrosterusermapping', t => {
    t.integer('erostererosterid').notNullable().references('eroster.erosterid').onDelete('CASCADE');
    t.integer('eprojecteprojectid').notNullable().references('eproject.eprojectid').onDelete('CASCADE');
    t.integer('eusereuserid').references('euser.euserid').onDelete('CASCADE');
    t.integer('eshifttimeeshifttimeid').notNullable().references('eshifttime.eshifttimeid').onDelete('CASCADE');
    t.bigInteger('eshiftdaytime').notNullable().defaultTo(0);
    t.string('erosterusermappingname').notNullable().defaultTo(0);
    t.integer('eshiftrosterusermappingcreateby').notNullable().defaultTo(0);
    t.bigInteger('eshiftrosterusermappingcreatetime').notNullable();
    t.integer('eshiftrosterusermappingchangeby');
    t.bigInteger('eshiftrosterusermappingchangetime');
    t.integer('eshiftrosterusermappingdeleteby');
    t.boolean('eshiftrosterusermappingdeletestatus').defaultTo(false);
    t.bigInteger('eshiftrosterusermappingdeletetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eshiftrosterusermapping');