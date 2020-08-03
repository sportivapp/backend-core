exports.seed = (knex, Promise) => knex('edevice').del()
    .then(() =>
        knex('edevice').insert(
            [
                {
                    edeviceidinfo: 'PT. Nawakara Perkasa Nusantara',
                    edeviceimei: '@nawakara.com',
                    edevicecreateby: 0
                },
                {
                    edeviceidinfo: 'PT. Nawakara Perkasa Nusantara',
                    edeviceimei: '@nawakara1.com',
                    edevicecreateby: 0
                },
            ]
        ));