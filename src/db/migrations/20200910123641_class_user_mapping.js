exports.up = (knex, Promise) => knex.schema.createTable('eclassusermapping', t => {
    t.increments('eclassusermappingid').primary().unsigned();
    t.integer('eclasseclassid').notNullable().references('eclass.eclassid').onDelete('CASCADE')
    t.integer('euseruserid').notNullable().references('euser.euserid').onDelete('CASCADE')
    t.enum('eclassusermappingstatus',['PENDING','APPROVED','REJECTED']).notNullable().defaultTo('PENDING');
    t.integer('eclassusermappingcreateby').notNullable();
    t.bigInteger('eclassusermappingcreatetime').notNullable().defaultTo(Date.now());
    t.integer('eclassusermappingchangeby');
    t.bigInteger('eclassusermappingchangetime');
    t.integer('eclassusermappingdeleteby');
    t.boolean('eclassusermappingdeletestatus').defaultTo(false);
    t.bigInteger('eclassusermappingdeletetime');
});

exports.down = (knex, Promise) => knex.schema.dropTable('eclassusermapping');
