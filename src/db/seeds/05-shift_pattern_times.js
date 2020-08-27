exports.seed = (knex, Promise) => knex('eshifttime').del()
    .then(() =>
        knex('eshifttime').insert(
            [
                {
                    eshifttimename: 'Pagi',
                    eshifttimestarthour: 7,
                    eshifttimestartminute: 0,
                    eshifttimeendhour: 15,
                    eshifttimeendminute: 0,
                    eshifttimecreateby: 1,
                    eshifttimecreatetime: Date.now(),
                    eshiftpatterneshiftpatternid: 1,
                    eshifteshiftid: 1
                }
            ]
        ));
