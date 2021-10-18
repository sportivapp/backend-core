exports.up = (knex, Promise) => knex.schema.createTable('class_rating_improvements', t => {
    t.increments('id').primary().unsigned();
    t.uuid('class_rating_uuid').references('class_ratings.uuid');
    t.string('code');
});

exports.down = (knex, Promise) => knex.schema.dropTable('class_rating_improvements');