exports.up = (knex, _) => knex.schema.createTable('ecity', t => {
    t.increments('ecityid').primary().unsigned();
    t.string('ecityname').notNullable();
    t.integer('estateestateid').references('estate.estateid');
    t.integer('ecountryecountryid').references('ecountry.ecountryid').notNullable();
    t.bigInteger('ecitycreatetime').notNullable().defaultTo(Date.now());
    t.integer('ecitycreateby').notNullable().defaultTo(0);
    t.bigInteger('ecitychangetime');
    t.integer('ecitychangeby');
}).then(() => findCountryByName(knex, 'Indonesia'))
    .then(country => newCityDataList(country))
    .then(cities => insertNewCitites(knex, cities));

function findCountryByName(knex, name) {
    return knex('ecountry')
        .where('ecountryname', name)
        .first()
}

function newCityDataList(country) {

    return [
        {
            ecityname: 'Banda Aceh',
            estateestateid: 3,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Langsa',
            estateestateid: 3,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Lhokseumawe',
            estateestateid: 3,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Meulaboh',
            estateestateid: 3,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Sabang',
            estateestateid: 3,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Subulussalam',
            estateestateid: 3,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Denpasar',
            estateestateid: 2,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Pangkalpinang',
            estateestateid: 5,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Cilegon',
            estateestateid: 1,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Serang',
            estateestateid: 1,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tangerang Selatan',
            estateestateid: 1,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tangerang',
            estateestateid: 1,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Bengkulu',
            estateestateid: 4,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Gorontalo',
            estateestateid: 11,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Kota Administrasi Jakarta Barat',
            estateestateid: 12,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Kota Administrasi Jakarta Pusat',
            estateestateid: 12,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Kota Administrasi Jakarta Selatan',
            estateestateid: 12,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Kota Administrasi Jakarta Timur',
            estateestateid: 12,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Kota Administrasi Jakarta Utara',
            estateestateid: 12,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Sungai Penuh',
            estateestateid: 13,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Jambi',
            estateestateid: 13,
            ecountryecountryid: country.ecountryid

        },
        {
            ecityname: 'Bandung',
            estateestateid: 8,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Bekasi',
            estateestateid: 8,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Bogor',
            estateestateid: 8,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Cimahi',
            estateestateid: 8,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Cirebon',
            estateestateid: 8,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Depok',
            estateestateid: 8,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Sukabumi',
            estateestateid: 8,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tasikmalaya',
            estateestateid: 8,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Banjar',
            estateestateid: 8,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Magelang',
            estateestateid: 7,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Pekalongan',
            estateestateid: 7,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Purwokerto',
            estateestateid: 7,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Salatiga',
            estateestateid: 7,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Semarang',
            estateestateid: 7,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Surakarta',
            estateestateid: 7,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tegal',
            estateestateid: 7,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Batu',
            estateestateid: 6,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Blitar',
            estateestateid: 6,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Kediri',
            estateestateid: 6,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Madiun',
            estateestateid: 6,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Malang',
            estateestateid: 6,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Mojokerto',
            estateestateid: 6,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Pasuruan',
            estateestateid: 6,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Probolinggo',
            estateestateid: 6,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Surabaya',
            estateestateid: 6,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Pontianak',
            estateestateid: 27,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Singkawang',
            estateestateid: 27,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Banjarbaru',
            estateestateid: 29,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Banjarmasin',
            estateestateid: 29,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Palangkaraya',
            estateestateid: 31,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Balikpapan',
            estateestateid: 28,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Bontang',
            estateestateid: 28,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Samarinda',
            estateestateid: 28,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tarakan',
            estateestateid: 30,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Batam',
            estateestateid: 26,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tanjungpinang',
            estateestateid: 26,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Bandar Lampung',
            estateestateid: 14,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Metro',
            estateestateid: 14,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Ternate',
            estateestateid: 16,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tidore Kepulauan',
            estateestateid: 16,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Ambon',
            estateestateid: 15,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tual',
            estateestateid: 15,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Bima',
            estateestateid: 10,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Mataram',
            estateestateid: 10,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Kupang',
            estateestateid: 9,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Sorong',
            estateestateid: 32,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Jayapura',
            estateestateid: 33,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Dumai',
            estateestateid: 25,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Pekanbaru',
            estateestateid: 25,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Makassar',
            estateestateid: 21,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Palopo',
            estateestateid: 21,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Parepare',
            estateestateid: 21,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Palu',
            estateestateid: 18,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Bau-Bau',
            estateestateid: 19,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Kendari',
            estateestateid: 19,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Bitung',
            estateestateid: 17,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Kotamobagu',
            estateestateid: 17,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Manado',
            estateestateid: 17,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tomohon',
            estateestateid: 17,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Bukittinggi',
            estateestateid: 24,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Padang',
            estateestateid: 24,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Padangpanjang',
            estateestateid: 24,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Pariaman',
            estateestateid: 24,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Payakumbuh',
            estateestateid: 24,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Sawahlunto',
            estateestateid: 24,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Solok',
            estateestateid: 24,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Lubuklinggau',
            estateestateid: 23,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Pagaralam',
            estateestateid: 23,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Palembang',
            estateestateid: 23,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Prabumulih',
            estateestateid: 23,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Binjai',
            estateestateid: 22,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Medan',
            estateestateid: 22,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Padang Sidempuan',
            estateestateid: 22,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Pematangsiantar',
            estateestateid: 22,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Sibolga',
            estateestateid: 22,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tanjungbalai',
            estateestateid: 22,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Tebingtinggi',
            estateestateid: 22,
            ecountryecountryid: country.ecountryid
        },
        {
            ecityname: 'Yogyakarta',
            estateestateid: 34,
            ecountryecountryid: country.ecountryid
        }
    ]
}

function insertNewCitites(knex, cities) {

    return knex('ecity')
        .insert(cities)
}

exports.down = (knex, _) => knex.schema.dropTable('ecity');