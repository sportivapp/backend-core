exports.up = (knex, _) => knex.schema.createTable('ecity', t => {
    t.increments('ecityid').primary().unsigned();
    t.string('ecityname').notNullable();
    t.integer('estateestateid');
    t.integer('ecountryecountryid').notNullable();
    t.bigInteger('ecitycreatetime').notNullable().defaultTo(Date.now());
    t.integer('ecitycreateby').notNullable().defaultTo(0);
    t.bigInteger('ecitychangetime');
    t.integer('ecitychangeby');
}).then(() => newCityDataList())
    .then(cities => insertNewCitites(knex, cities));

function newCityDataList() {

    return [
        {
            ecityname: 'Banda Aceh',
            estateestateid: 3,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Langsa',
            estateestateid: 3,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Lhokseumawe',
            estateestateid: 3,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Meulaboh',
            estateestateid: 3,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Sabang',
            estateestateid: 3,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Subulussalam',
            estateestateid: 3,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Denpasar',
            estateestateid: 2,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Pangkalpinang',
            estateestateid: 5,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Cilegon',
            estateestateid: 1,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Serang',
            estateestateid: 1,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tangerang Selatan',
            estateestateid: 1,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tangerang',
            estateestateid: 1,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Bengkulu',
            estateestateid: 4,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Gorontalo',
            estateestateid: 11,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Kota Administrasi Jakarta Barat',
            estateestateid: 12,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Kota Administrasi Jakarta Pusat',
            estateestateid: 12,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Kota Administrasi Jakarta Selatan',
            estateestateid: 12,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Kota Administrasi Jakarta Timur',
            estateestateid: 12,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Kota Administrasi Jakarta Utara',
            estateestateid: 12,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Sungai Penuh',
            estateestateid: 13,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Jambi',
            estateestateid: 13,
            ecountryecountryid: 1

        },
        {
            ecityname: 'Bandung',
            estateestateid: 8,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Bekasi',
            estateestateid: 8,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Bogor',
            estateestateid: 8,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Cimahi',
            estateestateid: 8,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Cirebon',
            estateestateid: 8,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Depok',
            estateestateid: 8,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Sukabumi',
            estateestateid: 8,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tasikmalaya',
            estateestateid: 8,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Banjar',
            estateestateid: 8,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Magelang',
            estateestateid: 7,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Pekalongan',
            estateestateid: 7,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Purwokerto',
            estateestateid: 7,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Salatiga',
            estateestateid: 7,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Semarang',
            estateestateid: 7,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Surakarta',
            estateestateid: 7,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tegal',
            estateestateid: 7,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Batu',
            estateestateid: 6,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Blitar',
            estateestateid: 6,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Kediri',
            estateestateid: 6,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Madiun',
            estateestateid: 6,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Malang',
            estateestateid: 6,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Mojokerto',
            estateestateid: 6,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Pasuruan',
            estateestateid: 6,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Probolinggo',
            estateestateid: 6,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Surabaya',
            estateestateid: 6,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Pontianak',
            estateestateid: 27,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Singkawang',
            estateestateid: 27,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Banjarbaru',
            estateestateid: 29,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Banjarmasin',
            estateestateid: 29,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Palangkaraya',
            estateestateid: 31,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Balikpapan',
            estateestateid: 28,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Bontang',
            estateestateid: 28,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Samarinda',
            estateestateid: 28,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tarakan',
            estateestateid: 30,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Batam',
            estateestateid: 26,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tanjungpinang',
            estateestateid: 26,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Bandar Lampung',
            estateestateid: 14,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Metro',
            estateestateid: 14,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Ternate',
            estateestateid: 16,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tidore Kepulauan',
            estateestateid: 16,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Ambon',
            estateestateid: 15,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tual',
            estateestateid: 15,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Bima',
            estateestateid: 10,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Mataram',
            estateestateid: 10,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Kupang',
            estateestateid: 9,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Sorong',
            estateestateid: 32,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Jayapura',
            estateestateid: 33,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Dumai',
            estateestateid: 25,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Pekanbaru',
            estateestateid: 25,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Makassar',
            estateestateid: 21,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Palopo',
            estateestateid: 21,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Parepare',
            estateestateid: 21,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Palu',
            estateestateid: 18,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Bau-Bau',
            estateestateid: 19,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Kendari',
            estateestateid: 19,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Bitung',
            estateestateid: 17,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Kotamobagu',
            estateestateid: 17,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Manado',
            estateestateid: 17,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tomohon',
            estateestateid: 17,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Bukittinggi',
            estateestateid: 24,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Padang',
            estateestateid: 24,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Padangpanjang',
            estateestateid: 24,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Pariaman',
            estateestateid: 24,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Payakumbuh',
            estateestateid: 24,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Sawahlunto',
            estateestateid: 24,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Solok',
            estateestateid: 24,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Lubuklinggau',
            estateestateid: 23,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Pagaralam',
            estateestateid: 23,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Palembang',
            estateestateid: 23,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Prabumulih',
            estateestateid: 23,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Binjai',
            estateestateid: 22,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Medan',
            estateestateid: 22,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Padang Sidempuan',
            estateestateid: 22,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Pematangsiantar',
            estateestateid: 22,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Sibolga',
            estateestateid: 22,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tanjungbalai',
            estateestateid: 22,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Tebingtinggi',
            estateestateid: 22,
            ecountryecountryid: 1
        },
        {
            ecityname: 'Yogyakarta',
            estateestateid: 34,
            ecountryecountryid: 1
        }
    ]
}

function insertNewCitites(knex, cities) {

    return knex('ecity')
        .insert(cities)
}

exports.down = (knex, _) => knex.schema.dropTable('ecity');