exports.seed = (knex, Promise) => knex('enotificationbody').del()
    .then(() =>
        knex('enotificationbody').insert(
            [
                {
                    // enotificationbodyentityid: 1,
                    enotificationbodyentitytype: 'COMPANY',
                    enotificationbodyaction: 'COMPANY_INVITE',
                    enotificationbodytitle: 'Company Invitation',
                    enotificationbodymessage: 'You have been invited to an Organization!',
                    enotificationbodysenderid: 4,
                    enotificationbodycreateby: 4,
                    enotificationbodycreatetime: 1575158400,
                    enotificationbodychangeby: 4,
                    enotificationbodychangetime: 1575158400
                },
                {
                    // enotificationbodyentityid: 2,
                    enotificationbodyentitytype: 'COMPANY',
                    enotificationbodyaction: 'COMPANY_INVITE',
                    enotificationbodytitle: 'Company Invitation',
                    enotificationbodymessage: 'You have been invited to a Organization!',
                    enotificationbodysenderid: 5,
                    enotificationbodycreateby: 5,
                    enotificationbodycreatetime: Date.now(),
                    enotificationbodychangeby: 5,
                    enotificationbodychangetime: Date.now()
                },
                {
                    // enotificationbodyentityid: 3,
                    enotificationbodyentitytype: 'COMPANY',
                    enotificationbodyaction: 'COMPANY_INVITE',
                    enotificationbodytitle: 'Company Invitation',
                    enotificationbodymessage: 'You have been invited to a Organization!',
                    enotificationbodysenderid: 3,
                    enotificationbodycreateby: 3,
                    enotificationbodycreatetime: 1519084800,
                    enotificationbodychangeby: 3,
                    enotificationbodychangetime: 1519084800
                },
                {
                    // enotificationbodyentityid: 4,
                    enotificationbodyentitytype: 'COMPANY',
                    enotificationbodyaction: 'COMPANY_INVITE',
                    enotificationbodytitle: 'Company Invitation',
                    enotificationbodymessage: 'You have been invited to a Organization!',
                    enotificationbodysenderid: 4,
                    enotificationbodycreateby: 4,
                    enotificationbodycreatetime: 1583193600,
                    enotificationbodychangeby: 4,
                    enotificationbodychangetime: 1583193600
                }          
            ]
        ));
