exports.seed = (knex, Promise) => knex('ethread').del()
    .then(() =>
        knex('ethread').insert(
            [
                {
                    ethreadtitle: 'Strategi bermain basket terbaik?',
                    ethreaddescription: 'Forum untuk berdiskusi tentang strategi terbaik bermain basket',
                    ethreadispublic: true,
                    ecompanyecompanyid: 1,
                    eteameteamid: null,
                    ethreadcreatetime: Date.now(),
                    ethreadcreateby: 1
                },
                {
                    ethreadtitle: 'Pemanasan yang paling baik sebelum olahraga?',
                    ethreaddescription: 'Forum ini bertujuan untuk membahas pemanasan atau perenggangan otot terbaik',
                    ethreadispublic: true,
                    ecompanyecompanyid: 1,
                    eteameteamid: null,
                    ethreadcreatetime: Date.now(),
                    ethreadcreateby: 4
                },
            ]
        ));