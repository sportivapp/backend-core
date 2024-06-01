exports.up = (knex, Promise) => knex.schema.createTable('eindustry', t => {
    t.increments('eindustryid').notNullable().primary().unsigned()
    t.text('eindustryname').notNullable()
    t.bigInteger('eindustrycreatetime').notNullable().defaultTo(Date.now())
    t.integer('eindustrycreateby').notNullable().defaultTo(0)
    t.integer('eindustrychangeby');
    t.bigInteger('eindustrychangetime');
    t.bigInteger('eindustrydeletetime')
    t.boolean('eindustrydeletestatus').defaultTo(false);
    t.integer('eindustrydeleteby')
}).then(() => newIndustryDataList())
.then(industries => insertNewIndustries(knex, industries));

function insertNewIndustries(knex, industries) {
    return knex('eindustry')
        .insert(industries)
}

function newIndustryDataList() {
    return [
        { eindustryname: 'Sepak Bola'},
        { eindustryname: 'Futsal'},
        { eindustryname: 'Basket'},
        { eindustryname: 'Badminton'},
        { eindustryname: 'Volley'},
        { eindustryname: 'Tennis'},
    ]
}


exports.down = (knex, Promise) => knex.schema.dropTable('eindustry');