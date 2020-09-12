exports.seed = (knex, Promise) => knex('eclass').del()
    .then(() =>
        knex('eclass').insert(
            [
                {
                    eclassname: "Class A",
                    eclassstartdate: 1599573209615,
                    eclassenddate: 1599673209615,
                    eclasstype: "PUBLIC",
                    eclassprice: 15000,
                    eclassaddress: "Banten",
                    eclassdescription: "Deskripsi Class A",
                    eclasspicname: "Steven",
                    eclasspicmobilenumber: "08123123123",
                    eindustryeindustryid: 1,
                    ecompanyecompanyid: 4,
                    efileefileid: 1,
                    eclasscreatetime: Date.now(),
                    eclasscreateby: 0
                },
                {
                    eclassname: "Class B",
                    eclassstartdate: 1599573209615,
                    eclassenddate: 1599673209615,
                    eclasstype: "PRIVATE",
                    eclassprice: 31000,
                    eclassaddress: "Banten",
                    eclassdescription: "Deskripsi Class B",
                    eclasspicname: "Steven",
                    eclasspicmobilenumber: "08123123123",
                    eindustryeindustryid: 1,
                    ecompanyecompanyid: 4,
                    efileefileid: 1,
                    eclasscreatetime: Date.now(),
                    eclasscreateby: 0
                }
            ]
        ));
