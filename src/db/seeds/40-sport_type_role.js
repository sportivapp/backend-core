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
                {
                    esporttyperolename: 'Goalkeeper',
                    eindustryeindustryid: 2,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Defender',
                    eindustryeindustryid: 2,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Winger',
                    eindustryeindustryid: 2,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Pivot/Target',
                    eindustryeindustryid: 2,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Point Guard (PG)',
                    eindustryeindustryid: 3,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Shooting Guard (SG)',
                    eindustryeindustryid: 3,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Small Forward (SF)',
                    eindustryeindustryid: 3,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Power Forward (PF)',
                    eindustryeindustryid: 3,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Center (C)',
                    eindustryeindustryid: 3,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Men’s Singles',
                    eindustryeindustryid: 4,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Women’s Singles',
                    eindustryeindustryid: 4,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Men’s Doubles',
                    eindustryeindustryid: 4,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Women’s Doubles',
                    eindustryeindustryid: 4,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Mix Doubles',
                    eindustryeindustryid: 4,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Outside Hitter',
                    eindustryeindustryid: 5,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Opposite Hitter',
                    eindustryeindustryid: 5,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Libero',
                    eindustryeindustryid: 5,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Middle Blocker/Hitter',
                    eindustryeindustryid: 5,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Setter',
                    eindustryeindustryid: 5,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Defensive Specialist',
                    eindustryeindustryid: 5,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Men’s Singles',
                    eindustryeindustryid: 6,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Women’s Singles',
                    eindustryeindustryid: 6,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Men’s Doubles',
                    eindustryeindustryid: 6,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Women’s Doubles',
                    eindustryeindustryid: 6,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
                {
                    esporttyperolename: 'Mix Doubles',
                    eindustryeindustryid: 6,
                    esporttyperolecreatetime: Date.now(),
                    esporttyperolecreateby: 0
                },
            ]
        ));