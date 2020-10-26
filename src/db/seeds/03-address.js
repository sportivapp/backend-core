exports.seed = (knex, Promise) => knex('eaddress').del()
  .then(() =>
    knex('eaddress').insert(
      [
        {
          eaddressstreet: 'Kompleks Golden Plaza, Jl. RS. Fatmawati Raya No.15, RT.10/RW.6, Gandaria Utara, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12420',
          // eaddresspostalcode: 12420,
          ecountryecountryid: 1,
          estateestateid: 1
        },
        {
          eaddressstreet: 'Jalan Lapangan 1',
          // eaddresspostalcode: 13300,
          ecountryecountryid: 1,
          estateestateid: 1
        },
        {
          eaddressstreet: 'Jalan',
          // eaddresspostalcode: 15000,
          ecountryecountryid: 1,
          estateestateid: 12
        }
      ]
));