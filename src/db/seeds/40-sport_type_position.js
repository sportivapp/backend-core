exports.seed = (knex, Promise) => knex('esporttyperole').del()
    .then(() =>
        knex('esporttyperole').insert(
            [
                {
                    esporttyperolename: 'Goalkeeper (GK)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Center Back (CB)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Left Fullback (LF)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Right Fullback (RB)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Left Wingback (LWB)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Right Wingback (RWB)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Sweeper (SW)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Defensive Midfielder (DM)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Central Midfielder (CM)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Attacking Midfielder (AM)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Left Midfielder (LM)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Right Midfielder (RM)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Center Forward (CF)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Striker (S)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Second Striker (SS)',
                    eindustryeindustryid: 1,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
            ]
        ));