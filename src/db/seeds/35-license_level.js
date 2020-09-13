exports.seed = (knex, Promise) => knex('elicenselevel').del()
    .then(() =>
        knex('elicenselevel').insert(
            [
                {
                  eindustryeindustryid: 1,
                  elicenselevelname: 'Lisensi D PSSI',
                  elicenselevelcreatetime: Date.now(),
                  elicenselevelcreateby: 0
                },
                {
                  eindustryeindustryid: 1,
                  elicenselevelname: 'Lisensi C PSSI',
                  elicenselevelcreatetime: Date.now(),
                  elicenselevelcreateby: 0
                },
                {
                  eindustryeindustryid: 1,
                  elicenselevelname: 'Lisensi C AFC',
                  elicenselevelcreatetime: Date.now(),
                  elicenselevelcreateby: 0
                },
                {
                  eindustryeindustryid: 1,
                  elicenselevelname: 'Lisensi B PSSI',
                  elicenselevelcreatetime: Date.now(),
                  elicenselevelcreateby: 0
                },
                {
                  eindustryeindustryid: 1,
                  elicenselevelname: 'Lisensi B AFC',
                  elicenselevelcreatetime: Date.now(),
                  elicenselevelcreateby: 0
                },
                {
                  eindustryeindustryid: 1,
                  elicenselevelname: 'Lisensi A AFC',
                  elicenselevelcreatetime: Date.now(),
                  elicenselevelcreateby: 0
                },
                {
                  eindustryeindustryid: 1,
                  elicenselevelname: 'Lisensi A Pro AFC',
                  elicenselevelcreatetime: Date.now(),
                  elicenselevelcreateby: 0
                },
                {
                    eindustryeindustryid: 1,
                    elicenselevelname: 'Other',
                    elicenselevelcreatetime: Date.now(),
                    elicenselevelcreateby: 0
                },
                {
                    eindustryeindustryid: 2,
                    elicenselevelname: 'Other',
                    elicenselevelcreatetime: Date.now(),
                    elicenselevelcreateby: 0
                },
                {
                    eindustryeindustryid: 3,
                    elicenselevelname: 'Other',
                    elicenselevelcreatetime: Date.now(),
                    elicenselevelcreateby: 0
                },
                {
                    eindustryeindustryid: 4,
                    elicenselevelname: 'Other',
                    elicenselevelcreatetime: Date.now(),
                    elicenselevelcreateby: 0
                },
                {
                    eindustryeindustryid: 5,
                    elicenselevelname: 'Other',
                    elicenselevelcreatetime: Date.now(),
                    elicenselevelcreateby: 0
                },
                {
                    eindustryeindustryid: 6,
                    elicenselevelname: 'Other',
                    elicenselevelcreatetime: Date.now(),
                    elicenselevelcreateby: 0
                }
            ]
        ));
