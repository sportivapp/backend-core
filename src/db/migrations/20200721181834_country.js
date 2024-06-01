exports.up = (knex, Promise) => knex.schema.createTable('ecountry', t => {
    t.increments('ecountryid').primary().unsigned();
    t.string('ecountryname').notNullable();
    t.integer('ecountrycreateby').notNullable().defaultTo(0);
    t.bigInteger('ecountrycreatetime').notNullable().defaultTo(Date.now());
    t.integer('ecountrychangeby');
    t.bigInteger('ecountrychangetime');
    t.integer('ecountrydeleteby');
    t.bigInteger('ecountrydeletetime');
    t.boolean('ecountrydeletestatus').defaultTo(false);
    t.integer('ecountrytablestatus').notNullable().defaultTo(1);
  }).then(() => newCountryDataList())
  .then(countries => insertNewCountries(knex, countries));

  function insertNewCountries(knex, countries) {

    return knex('ecountry')
        .insert(countries)
  }

  function newCountryDataList() {

    return [
      {
        ecountryname: 'Indonesia'
      },
      {
        ecountryname: 'Brunei Darussalam'
      },
      {
        ecountryname: 'Kamboja'
      },
      {
        ecountryname: 'Laos'
      },
      {
        ecountryname: 'Malaysia'
      },
      {
        ecountryname: 'Myanmar'
      },
      {
        ecountryname: 'Filipina'
      },
      {
        ecountryname: 'Singapura'
      },
      {
        ecountryname: 'Thailand'
      },
      {
        ecountryname: 'Vietnam'
      },
    ]
  }

  exports.down = (knex, Promise) => knex.schema.dropTable('ecountry');