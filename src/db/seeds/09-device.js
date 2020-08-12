exports.seed = (knex, Promise) => knex('edevice').del()
    .then(() =>
        knex('edevice').insert(
            [
                {
                    edeviceidinfo: 'Mesin Absen 1 PT. Nawakara Perkasa Nusantara',
                    edeviceimei: '11111',
                    edevicecreateby: 0,
                    ecompanyecompanyid: 1
                },
                {
                    edeviceidinfo: 'Mesin Absen 2 PT. Nawakara Perkasa Nusantara',
                    edeviceimei: '22222',
                    edevicecreateby: 0,
                    ecompanyecompanyid: 1
                },
            ]
        ));