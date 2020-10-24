exports.up = (knex, Promise) => knex.schema.createTable('ereportthreadtype', t => {
    t.increments('ereportthreadtypeid').notNullable().primary().unsigned()
    t.text('ereportthreadtypename').notNullable()
    t.bigInteger('ereportthreadtypecreatetime').notNullable().defaultTo(Date.now())
    t.integer('ereportthreadtypecreateby').notNullable().defaultTo(0)
    t.integer('ereportthreadtypechangeby');
    t.bigInteger('ereportthreadtypechangetime');
}).then(() => knex('ereportthreadtype').insert(reportTypes()));

function reportTypes() {
    return [
        {
            ereportthreadtypename: `I'm not interested (later)`,
            ereportthreadtypecreateby: 0,
            ereportthreadtypecreatetime: Date.now(),
        },
        {
            ereportthreadtypename: `It's Suspicious or spam`,
            ereportthreadtypecreateby: 0,
            ereportthreadtypecreatetime: Date.now(),
        },
        {
            ereportthreadtypename: `It displays a sensitive photo/video`,
            ereportthreadtypecreateby: 0,
            ereportthreadtypecreatetime: Date.now(),
        },
        {
            ereportthreadtypename: `It's abusive or harmful`,
            ereportthreadtypecreateby: 0,
            ereportthreadtypecreatetime: Date.now(),
        },
        {
            ereportthreadtypename: `It expresses intentions of self-harm or suicide`,
            ereportthreadtypecreateby: 0,
            ereportthreadtypecreatetime: Date.now(),
        }
    ]
}

exports.down = (knex, Promise) => knex.schema.dropTable('ereportthreadtype');