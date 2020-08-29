exports.up = (knex, Promise) => knex.schema.createTable('eshifttime', t => {
    t.increments('eshifttimeid').primary().unsigned();
    t.string('eshifttimename').notNullable();
    t.bigInteger('eshifttimestarthour').notNullable();
    t.bigInteger('eshifttimestartminute').notNullable();
    t.bigInteger('eshifttimeendhour').notNullable();
    t.bigInteger('eshifttimeendminute').notNullable();
    t.integer('eshifttimecreateby').notNullable();
    t.bigInteger('eshifttimecreatetime').notNullable();
    t.integer('eshifttimechangeby');
    t.bigInteger('eshifttimechangetime');
    t.integer('eshifteshiftid').notNullable().references('eshift.eshiftid').onDelete('CASCADE');
    t.integer('eshiftpatterneshiftpatternid').notNullable().references('eshiftpattern.eshiftpatternid').onDelete('CASCADE');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eshifttime');