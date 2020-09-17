exports.seed = (knex, Promise) => knex('elicense').del()
    .then(() =>
        knex('elicense').insert(
            [
                {
                  elicenseacademicname: "tes license",
                  elicensegraduationdate: Date.now(),
                  eindustryeindustryid: 1,
                  elicenselevelelicenselevelid: 8,
                  elicenseadditionalinformation: "none",
                  efileefileid: 1,
                  elicensecreatetime: Date.now(),
                  elicensecreateby: 7
                },
            ]
        ));
