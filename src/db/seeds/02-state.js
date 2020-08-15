exports.seed = (knex, Promise) => knex('estate').del()
  .then(() =>
    knex('estate').insert(
      [
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
      ]
));
