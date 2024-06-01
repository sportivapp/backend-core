exports.up = (knex, Promise) => knex.schema.createTable('estate', t => {
    t.increments('estateid').primary().unsigned();
    t.string('estatename').notNullable();
    t.string('estatecode');
    t.integer('estatecreateby').notNullable().defaultTo(0);
    t.bigInteger('estatecreatetime').notNullable().defaultTo(Date.now());
    t.integer('estatechangeby');
    t.bigInteger('estatechangetime');
    t.integer('estatedeleteby');
    t.bigInteger('estatedeletetime');
    t.boolean('estatedeletestatus').defaultTo(false);
    t.integer('estatetablestatus').notNullable().defaultTo(1);
    t.integer('ecountryecountryid').notNullable().references('ecountry.ecountryid');
  }).then(() => newStateDataList())
  .then(states => insertNewStates(knex, states));

  function insertNewStates(knex, states) {

    return knex('estate')
        .insert(states)
  }

  function newStateDataList() {
    return [
      {
        estatename: 'Banten',
        ecountryecountryid: 1
      },
      {
        estatename: 'Bali',
        ecountryecountryid: 1
      },
      {
        estatename: 'Aceh',
        ecountryecountryid: 1
      },
      {
        estatename: 'Bengkulu',
        ecountryecountryid: 1
      },
      {
        estatename: 'Bangka Belitung',
        ecountryecountryid: 1
      },
      {
        estatename: 'Jawa Timur',
        ecountryecountryid: 1
      },
      {
        estatename: 'Jawa Tengah',
        ecountryecountryid: 1
      },
      {
        estatename: 'Jawa Barat',
        ecountryecountryid: 1
      },
      {
        estatename: 'Nusa Tenggara Tengah',
        ecountryecountryid: 1
      },
      {
        estatename: 'Nusa Tenggara Barat',
        ecountryecountryid: 1
      },
      {
        estatename: 'Gorontalo',
        ecountryecountryid: 1
      },
      {
        estatename: 'DKI Jakarta',
        ecountryecountryid: 1
      },
      {
        estatename: 'Jambi',
        ecountryecountryid: 1
      },
      {
        estatename: 'Lampung',
        ecountryecountryid: 1
      },
      {
        estatename: 'Maluku',
        ecountryecountryid: 1
      },
      {
        estatename: 'Maluku Utara',
        ecountryecountryid: 1
      },
      {
        estatename: 'Sulawesi Utara',
        ecountryecountryid: 1
      },
      {
        estatename: 'Sulawesi Tengah',
        ecountryecountryid: 1
      },
      {
        estatename: 'Sulawesi Tenggara',
        ecountryecountryid: 1
      },
      {
        estatename: 'Sulawesi Barat',
        ecountryecountryid: 1
      },
      {
        estatename: 'Sulawesi Selatan',
        ecountryecountryid: 1
      },
      {
        estatename: 'Sumatera Utara',
        ecountryecountryid: 1
      },
      {
        estatename: 'Sumatera Selatan',
        ecountryecountryid: 1
      },
      {
        estatename: 'Sumatera Barat',
        ecountryecountryid: 1
      },
      {
        estatename: 'Riau',
        ecountryecountryid: 1
      },
      {
        estatename: 'Kepulauan Riau',
        ecountryecountryid: 1
      },
      {
        estatename: 'Kalimantan Barat',
        ecountryecountryid: 1
      },
      {
        estatename: 'Kalimantan Timur',
        ecountryecountryid: 1
      },
      {
        estatename: 'Kalimantan Selatan',
        ecountryecountryid: 1
      },
      {
        estatename: 'Kalimantan Utara',
        ecountryecountryid: 1
      },
      {
        estatename: 'Kalimantan Tengah',
        ecountryecountryid: 1
      },
      {
        estatename: 'Papua Barat',
        ecountryecountryid: 1
      },
      {
        estatename: 'Papua',
        ecountryecountryid: 1
      },
      {
        estatename: 'DI Yogyakarta',
        ecountryecountryid: 1
      },
      {
        estatename: 'Belait',
        ecountryecountryid: 2
      },
      {
        estatename: 'Brunei dan Muara',
        ecountryecountryid: 2
      },
      {
        estatename: 'Temburong',
        ecountryecountryid: 2
      },
      {
        estatename: 'Tutong',
        ecountryecountryid: 2
      },
      {
        estatename: 'Banteay Meanchey',
        ecountryecountryid: 3
      },
      {
        estatename: 'Battambang',
        ecountryecountryid: 3
      },
      {
        estatename: 'Kampong Cham',
        ecountryecountryid: 3
      },
      {
        estatename: 'Kampong Chhnang',
        ecountryecountryid: 3
      },
      {
        estatename: 'Kampong Speu',
        ecountryecountryid: 3
      },
      {
        estatename: 'Kampong Thom',
        ecountryecountryid: 3
      },
      {
        estatename: 'Kampot',
        ecountryecountryid: 3
      },
      {
        estatename: 'Kandal',
        ecountryecountryid: 3
      },
      {
        estatename: 'Koh Kong',
        ecountryecountryid: 3
      },
      {
        estatename: 'Kratié',
        ecountryecountryid: 3
      },
      {
        estatename: 'Mondulkiri',
        ecountryecountryid: 3
      },
      {
        estatename: 'Oddar Meancheay',
        ecountryecountryid: 3
      },
      {
        estatename: 'Pursat',
        ecountryecountryid: 3
      },
      {
        estatename: 'Preah Vihear',
        ecountryecountryid: 3
      },
      {
        estatename: 'Prey Veng',
        ecountryecountryid: 3
      },
      {
        estatename: 'Ratanakiri',
        ecountryecountryid: 3
      },
      {
        estatename: 'Siem Reap',
        ecountryecountryid: 3
      },
      {
        estatename: 'Stung Treng',
        ecountryecountryid: 3
      },
      {
        estatename: 'Svay Rieng',
        ecountryecountryid: 3
      },
      {
        estatename: 'Takéo',
        ecountryecountryid: 3
      },
      {
        estatename: 'Attapu',
        ecountryecountryid: 4
      },
      {
        estatename: 'Bokeo',
        ecountryecountryid: 4
      },
      {
        estatename: 'Borikhamxay',
        ecountryecountryid: 4
      },
      {
        estatename: 'Champassack',
        ecountryecountryid: 4
      },
      {
        estatename: 'Houaphan',
        ecountryecountryid: 4
      },
      {
        estatename: 'Khammouane',
        ecountryecountryid: 4
      },
      {
        estatename: 'Louang Namtha',
        ecountryecountryid: 4
      },
      {
        estatename: 'Louangphabang',
        ecountryecountryid: 4
      },
      {
        estatename: 'Oudomxay',
        ecountryecountryid: 4
      },
      {
        estatename: 'Phongsaly',
        ecountryecountryid: 4
      },
      {
        estatename: 'Saravane',
        ecountryecountryid: 4
      },
      {
        estatename: 'Savannakhet',
        ecountryecountryid: 4
      },
      {
        estatename: 'Vientiane',
        ecountryecountryid: 4
      },
      {
        estatename: 'Provinsi Vientiane',
        ecountryecountryid: 4
      },
      {
        estatename: 'Xaignabouli',
        ecountryecountryid: 4
      },
      {
        estatename: 'Saysomboun',
        ecountryecountryid: 4
      },
      {
        estatename: 'Xekong',
        ecountryecountryid: 4
      },
      {
        estatename: 'Xiangkhoang',
        ecountryecountryid: 4
      },
      {
        estatename: 'Johor',
        ecountryecountryid: 5
      },
      {
        estatename: 'Kedah',
        ecountryecountryid: 5
      },
      {
        estatename: 'Kelantan',
        ecountryecountryid: 5
      },
      {
        estatename: 'Melaka',
        ecountryecountryid: 5
      },
      {
        estatename: 'Negeri Sembilan',
        ecountryecountryid: 5
      },
      {
        estatename: 'Pahang',
        ecountryecountryid: 5
      },
      {
        estatename: 'Perak',
        ecountryecountryid: 5
      },
      {
        estatename: 'Perlis',
        ecountryecountryid: 5
      },
      {
        estatename: 'Pinang',
        ecountryecountryid: 5
      },
      {
        estatename: 'Sabah',
        ecountryecountryid: 5
      },
      {
        estatename: 'Sarawak',
        ecountryecountryid: 5
      },
      {
        estatename: 'Selangor',
        ecountryecountryid: 5
      },
      {
        estatename: 'Terengganu',
        ecountryecountryid: 5
      },
      {
        estatename: 'Ayeyarwady Region',
        ecountryecountryid: 6
      },
      {
        estatename: 'Bago Region',
        ecountryecountryid: 6
      },
      {
        estatename: 'Magway Region',
        ecountryecountryid: 6
      },
      {
        estatename: 'Mandalay Region',
        ecountryecountryid: 6
      },
      {
        estatename: 'Sagaing Region',
        ecountryecountryid: 6
      },
      {
        estatename: 'Tanintharyi Region',
        ecountryecountryid: 6
      },
      {
        estatename: 'Yangon Region',
        ecountryecountryid: 6
      },
      {
        estatename: 'Chin State',
        ecountryecountryid: 6
      },
      {
        estatename: 'Kachin State',
        ecountryecountryid: 6
      },
      {
        estatename: 'Kayah State',
        ecountryecountryid: 6
      },
      {
        estatename: 'Kayin State',
        ecountryecountryid: 6
      },
      {
        estatename: 'Mon State',
        ecountryecountryid: 6
      },
      {
        estatename: 'Rakhine State',
        ecountryecountryid: 6
      },
      {
        estatename: 'Shan State',
        ecountryecountryid: 6
      },
      {
        estatename: 'Naypyidaw Union Territory',
        ecountryecountryid: 6
      },
      {
        estatename: 'Cebu',
        ecountryecountryid: 7
      },
      {
        estatename: 'Cavite',
        ecountryecountryid: 7
      },
      {
        estatename: 'Bulacan',
        ecountryecountryid: 7
      },
      {
        estatename: 'Negros Occidental',
        ecountryecountryid: 7
      },
      {
        estatename: 'Laguna',
        ecountryecountryid: 7
      },
      {
        estatename: 'Pangasinan',
        ecountryecountryid: 7
      },
      {
        estatename: 'Rizal',
        ecountryecountryid: 7
      },
      {
        estatename: 'Batangas',
        ecountryecountryid: 7
      },
      {
        estatename: 'Pampanga',
        ecountryecountryid: 7
      },
      {
        estatename: 'Iloilo',
        ecountryecountryid: 7
      },
      {
        estatename: 'Davao del Sur',
        ecountryecountryid: 7
      },
      {
        estatename: 'Nueva Ecija',
        ecountryecountryid: 7
      },
      {
        estatename: 'Quezon',
        ecountryecountryid: 7
      },
      {
        estatename: 'Leyte',
        ecountryecountryid: 7
      },
      {
        estatename: 'Camarines Sur',
        ecountryecountryid: 7
      },
      {
        estatename: 'Zamboanga del Sur',
        ecountryecountryid: 7
      },
      {
        estatename: 'Isabela',
        ecountryecountryid: 7
      },
      {
        estatename: 'Misamis Oriental',
        ecountryecountryid: 7
      },
      {
        estatename: 'South Cotabato',
        ecountryecountryid: 7
      },
      {
        estatename: 'Maguindanao',
        ecountryecountryid: 7
      },
      {
        estatename: 'Bukidnon',
        ecountryecountryid: 7
      },
      {
        estatename: 'Cotabato',
        ecountryecountryid: 7
      },
      {
        estatename: 'Tarlac',
        ecountryecountryid: 7
      },
      {
        estatename: 'Negros Oriental',
        ecountryecountryid: 7
      },
      {
        estatename: 'Albay',
        ecountryecountryid: 7
      },
      {
        estatename: 'Bohol',
        ecountryecountryid: 7
      },
      {
        estatename: 'Cagayan',
        ecountryecountryid: 7
      },
      {
        estatename: 'Palawan',
        ecountryecountryid: 7
      },
      {
        estatename: 'Lanao del Sur',
        ecountryecountryid: 7
      },
      {
        estatename: 'Lanao del Norte',
        ecountryecountryid: 7
      },
      {
        estatename: 'Davao del Norte',
        ecountryecountryid: 7
      },
      {
        estatename: 'Zamboanga del Norte',
        ecountryecountryid: 7
      },
      {
        estatename: 'Masbate',
        ecountryecountryid: 7
      },
      {
        estatename: 'Oriental Mindoro',
        ecountryecountryid: 7
      },
      {
        estatename: 'Sulu',
        ecountryecountryid: 7
      },
      {
        estatename: 'Zambales',
        ecountryecountryid: 7
      },
      {
        estatename: 'Sultan Kudarat',
        ecountryecountryid: 7
      },
      {
        estatename: 'Sorsogon',
        ecountryecountryid: 7
      },
      {
        estatename: 'Benguet',
        ecountryecountryid: 7
      },
      {
        estatename: 'La Union',
        ecountryecountryid: 7
      },
      {
        estatename: 'Samar',
        ecountryecountryid: 7
      },
      {
        estatename: 'Capiz',
        ecountryecountryid: 7
      },
      {
        estatename: 'Bataan',
        ecountryecountryid: 7
      },
      {
        estatename: 'Davao de Oro',
        ecountryecountryid: 7
      },
      {
        estatename: 'Agusan del Sur',
        ecountryecountryid: 7
      },
      {
        estatename: 'Agusan del Norte',
        ecountryecountryid: 7
      },
      {
        estatename: 'Ilocos Sur',
        ecountryecountryid: 7
      },
      {
        estatename: 'Zamboanga Sibugay',
        ecountryecountryid: 7
      },
      {
        estatename: 'Northern Samar',
        ecountryecountryid: 7
      },
      {
        estatename: 'Misamis Occidental',
        ecountryecountryid: 7
      },
      {
        estatename: 'Ilocos Norte',
        ecountryecountryid: 7
      },
      {
        estatename: 'Surigao del Sur',
        ecountryecountryid: 7
      },
      {
        estatename: 'Camarines Norte',
        ecountryecountryid: 7
      },
      {
        estatename: 'Antique',
        ecountryecountryid: 7
      },
      {
        estatename: 'Aklan',
        ecountryecountryid: 7
      },
      {
        estatename: 'Davao Oriental',
        ecountryecountryid: 7
      },
      {
        estatename: 'Sarangani',
        ecountryecountryid: 7
      },
      {
        estatename: 'Occidental Mindoro',
        ecountryecountryid: 7
      },
      {
        estatename: 'Surigao del Norte',
        ecountryecountryid: 7
      },
      {
        estatename: 'Eastern Samar',
        ecountryecountryid: 7
      },
      {
        estatename: 'Basilan',
        ecountryecountryid: 7
      },
      {
        estatename: 'Nueva Vizcaya',
        ecountryecountryid: 7
      },
      {
        estatename: 'Southern Leyte',
        ecountryecountryid: 7
      },
      {
        estatename: 'Tawi-Tawi',
        ecountryecountryid: 7
      },
      {
        estatename: 'Davao Occidental',
        ecountryecountryid: 7
      },
      {
        estatename: 'Romblon',
        ecountryecountryid: 7
      },
      {
        estatename: 'Catanduanes',
        ecountryecountryid: 7
      },
      {
        estatename: 'Abra',
        ecountryecountryid: 7
      },
      {
        estatename: 'Marinduque',
        ecountryecountryid: 7
      },
      {
        estatename: 'Aurora',
        ecountryecountryid: 7
      },
      {
        estatename: 'Kalinga',
        ecountryecountryid: 7
      },
      {
        estatename: 'Ifugao',
        ecountryecountryid: 7
      },
      {
        estatename: 'Quirino',
        ecountryecountryid: 7
      },
      {
        estatename: 'Guimaras',
        ecountryecountryid: 7
      },
      {
        estatename: 'Biliran',
        ecountryecountryid: 7
      },
      {
        estatename: 'Mountain Province',
        ecountryecountryid: 7
      },
      {
        estatename: 'Dinagat Islands',
        ecountryecountryid: 7
      },
      {
        estatename: 'Apayao',
        ecountryecountryid: 7
      },
      {
        estatename: 'Siquijor',
        ecountryecountryid: 7
      },
      {
        estatename: 'Camiguin',
        ecountryecountryid: 7
      },
      {
        estatename: 'Batanes',
        ecountryecountryid: 7
      },
      {
        estatename: 'Changi Bay',
        ecountryecountryid: 8
      },
      {
        estatename: 'Marina East	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Marina South	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Simpang	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Straits View	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Western Islands	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Central Water Catchment	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Tengah',
        ecountryecountryid: 8
      },
      {
        estatename: 'Boon Lay	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Paya Lebar',
        ecountryecountryid: 8
      },
      {
        estatename: 'North-Eastern Islands	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Tuas	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Lim Chu Kang	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Pioneer	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Seletar	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Museum	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Sungei Kadut',
        ecountryecountryid: 8
      },
      {
        estatename: 'Western Water Catchment',
        ecountryecountryid: 8
      },
      {
        estatename: 'Orchard	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Southern Islands',
        ecountryecountryid: 8
      },
      {
        estatename: 'Mandai	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Changi',
        ecountryecountryid: 8
      },
      {
        estatename: 'Singapore River	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Downtown Core',
        ecountryecountryid: 8
      },
      {
        estatename: 'Newton	',
        ecountryecountryid: 8
      },
      {
        estatename: 'River Valley',
        ecountryecountryid: 8
      },
      {
        estatename: 'Rochor',
        ecountryecountryid: 8
      },
      {
        estatename: 'Tanglin',
        ecountryecountryid: 8
      },
      {
        estatename: 'Outram',
        ecountryecountryid: 8
      },
      {
        estatename: 'Novena',
        ecountryecountryid: 8
      },
      {
        estatename: 'Marine Parade',
        ecountryecountryid: 8
      },
      {
        estatename: 'Bukit Timah	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Sembawang',
        ecountryecountryid: 8
      },
      {
        estatename: 'Jurong East',
        ecountryecountryid: 8
      },
      {
        estatename: 'Bishan	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Clementi',
        ecountryecountryid: 8
      },
      {
        estatename: 'Queenstown',
        ecountryecountryid: 8
      },
      {
        estatename: 'Kallang	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Punggol',
        ecountryecountryid: 8
      },
      {
        estatename: 'Geylang	',
        ecountryecountryid: 8
      },
      {
        estatename: 'Serangoon',
        ecountryecountryid: 8
      },
      {
        estatename: 'Toa Payoh',
        ecountryecountryid: 8
      },
      {
        estatename: 'Bukit Panjang',
        ecountryecountryid: 8
      },
      {
        estatename: 'Bukit Batok',
        ecountryecountryid: 8
      },
      {
        estatename: 'Pasir Ris',
        ecountryecountryid: 8
      },
      {
        estatename: 'Bukit Merah',
        ecountryecountryid: 8
      },
      {
        estatename: 'Choa Chu Kang',
        ecountryecountryid: 8
      },
      {
        estatename: 'Ang Mo Kio',
        ecountryecountryid: 8
      },
      {
        estatename: 'Yishun',
        ecountryecountryid: 8
      },
      {
        estatename: 'Sengkang',
        ecountryecountryid: 8
      },
      {
        estatename: 'Hougang',
        ecountryecountryid: 8
      },
      {
        estatename: 'Woodlands',
        ecountryecountryid: 8
      },
      {
        estatename: 'Tampines',
        ecountryecountryid: 8
      },
      {
        estatename: 'Jurong West',
        ecountryecountryid: 8
      },
      {
        estatename: 'Bedok',
        ecountryecountryid: 8
      },
      {
        estatename: 'Chiang Mai',
        ecountryecountryid: 9
      },
      {
        estatename: 'Chiang Rai',
        ecountryecountryid: 9
      },
      {
        estatename: 'Kamphaeng Phet',
        ecountryecountryid: 9
      },
      {
        estatename: 'Lampang',
        ecountryecountryid: 9
      },
      {
        estatename: 'Lamphun',
        ecountryecountryid: 9
      },
      {
        estatename: 'Mae Hong Son',
        ecountryecountryid: 9
      },
      {
        estatename: 'Nakhon Sawan',
        ecountryecountryid: 9
      },
      {
        estatename: 'Nan',
        ecountryecountryid: 9
      },
      {
        estatename: 'Phayao',
        ecountryecountryid: 9
      },
      {
        estatename: 'Phetchabun',
        ecountryecountryid: 9
      },
      {
        estatename: 'Phichit',
        ecountryecountryid: 9
      },
      {
        estatename: 'Phitsanulok',
        ecountryecountryid: 9
      },
      {
        estatename: 'Phrae',
        ecountryecountryid: 9
      },
      {
        estatename: 'Sukhothai',
        ecountryecountryid: 9
      },
      {
        estatename: 'Tak',
        ecountryecountryid: 9
      },
      {
        estatename: 'Uthai Thani',
        ecountryecountryid: 9
      },
      {
        estatename: 'Uttaradit',
        ecountryecountryid: 9
      },
      {
        estatename: 'Chachoengsao',
        ecountryecountryid: 9
      },
      {
        estatename: 'Chanthaburi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Chonburi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Rayong',
        ecountryecountryid: 9
      },
      {
        estatename: 'Prachinburi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Sa Kaeo',
        ecountryecountryid: 9
      },
      {
        estatename: 'Trat',
        ecountryecountryid: 9
      },
      {
        estatename: 'Chumphon',
        ecountryecountryid: 9
      },
      {
        estatename: 'Krabi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Nakhon Si Thammarat',
        ecountryecountryid: 9
      },
      {
        estatename: 'Narathiwat',
        ecountryecountryid: 9
      },
      {
        estatename: 'Pattani',
        ecountryecountryid: 9
      },
      {
        estatename: 'Phang Nga',
        ecountryecountryid: 9
      },
      {
        estatename: 'Phattalung',
        ecountryecountryid: 9
      },
      {
        estatename: 'Phuket',
        ecountryecountryid: 9
      },
      {
        estatename: 'Ranong',
        ecountryecountryid: 9
      },
      {
        estatename: 'Satun',
        ecountryecountryid: 9
      },
      {
        estatename: 'Songkhla',
        ecountryecountryid: 9
      },
      {
        estatename: 'Surat Thani',
        ecountryecountryid: 9
      },
      {
        estatename: 'Trang',
        ecountryecountryid: 9
      },
      {
        estatename: 'Yala',
        ecountryecountryid: 9
      },
      {
        estatename: 'Amnat Charoen',
        ecountryecountryid: 9
      },
      {
        estatename: 'Bueng Kan',
        ecountryecountryid: 9
      },
      {
        estatename: 'Buriram',
        ecountryecountryid: 9
      },
      {
        estatename: 'Chaiyaphum',
        ecountryecountryid: 9
      },
      {
        estatename: 'Kalasin',
        ecountryecountryid: 9
      },
      {
        estatename: 'Khon Kaen',
        ecountryecountryid: 9
      },
      {
        estatename: 'Loei',
        ecountryecountryid: 9
      },
      {
        estatename: 'Maha Sarakham',
        ecountryecountryid: 9
      },
      {
        estatename: 'Mukdahan',
        ecountryecountryid: 9
      },
      {
        estatename: 'Nakhon Phanom',
        ecountryecountryid: 9
      },
      {
        estatename: 'Nakhon Ratchasima',
        ecountryecountryid: 9
      },
      {
        estatename: 'Nongbua Lamphu',
        ecountryecountryid: 9
      },
      {
        estatename: 'Nong Khai',
        ecountryecountryid: 9
      },
      {
        estatename: 'Roi Et',
        ecountryecountryid: 9
      },
      {
        estatename: 'Sakon Nakhon',
        ecountryecountryid: 9
      },
      {
        estatename: 'Sisaket',
        ecountryecountryid: 9
      },
      {
        estatename: 'Surin',
        ecountryecountryid: 9
      },
      {
        estatename: 'Ubon Ratchathani',
        ecountryecountryid: 9
      },
      {
        estatename: 'Udon Thani',
        ecountryecountryid: 9
      },
      {
        estatename: 'Yasothon',
        ecountryecountryid: 9
      },
      {
        estatename: 'Ang Thong',
        ecountryecountryid: 9
      },
      {
        estatename: 'Ayutthaya',
        ecountryecountryid: 9
      },
      {
        estatename: 'Bangkok',
        ecountryecountryid: 9
      },
      {
        estatename: 'Chainat',
        ecountryecountryid: 9
      },
      {
        estatename: 'Kanchanaburi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Lopburi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Nakhon Nayok',
        ecountryecountryid: 9
      },
      {
        estatename: 'Nakhon Pathom',
        ecountryecountryid: 9
      },
      {
        estatename: 'Nonthaburi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Pathumthani',
        ecountryecountryid: 9
      },
      {
        estatename: 'Phetchaburi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Prachuap Khiri Khan',
        ecountryecountryid: 9
      },
      {
        estatename: 'Ratchaburi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Samut Prakan',
        ecountryecountryid: 9
      },
      {
        estatename: 'Samut Sakhon',
        ecountryecountryid: 9
      },
      {
        estatename: 'Samut Songkhram',
        ecountryecountryid: 9
      },
      {
        estatename: 'Saraburi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Sing Buri',
        ecountryecountryid: 9
      },
      {
        estatename: 'Suphanburi',
        ecountryecountryid: 9
      },
      {
        estatename: 'Provinsi Bắc Giang',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Bắc Kạn',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Cao Bằng',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Hà Giang',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Lạng Sơn',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Phú Thọ',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Quảng Ninh',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Thái Nguyên',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Tuyên Quang',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Lào Cai',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Yên Bái',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Điện Biên',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Hòa Bình',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Lai Châu',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Sơn La',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Bắc Ninh',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Hà Nam',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Hải Dương',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Hưng Yên',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Nam Định',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Ninh Bình',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Thái Bình',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Vĩnh Phúc',
        ecountryecountryid: 10
      },
      {
        estatename: 'Kota Hà Nội',
        ecountryecountryid: 10
      },
      {
        estatename: 'Kota Hải Phòng',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Hà Tĩnh',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Nghệ An',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Quảng Bình',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Quảng Trị',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Thanh Hóa',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Thừa Thiên–Huế',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Đắk Lắk',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Đắk Nông',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Gia Lai',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Kon Tum',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Lâm Đồng',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Bình Định',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Bình Thuận',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Khánh Hòa',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Ninh Thuận',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Phú Yên',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Quảng Nam',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Quảng Ngãi',
        ecountryecountryid: 10
      },
      {
        estatename: 'Kota Đà Nẵng',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Bà Rịa–Vũng Tàu',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Bình Dương',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Bình Phước',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Đồng Nai',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Tây Ninh',
        ecountryecountryid: 10
      },
      {
        estatename: 'Kota Hồ Chí Minh',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi An Giang',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Bạc Liêu',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Bến Tre',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Cà Mau',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Đồng Tháp',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Hậu Giang',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Kiên Giang',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Long An',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Sóc Trăng',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Tiền Giang',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Trà Vinh',
        ecountryecountryid: 10
      },
      {
        estatename: 'Provinsi Vĩnh Long',
        ecountryecountryid: 10
      },
      {
        estatename: 'Kota Cần Thơ',
        ecountryecountryid: 10
      },
    ]
  }
  
  exports.down = (knex, Promise) => knex.schema.dropTable('estate');