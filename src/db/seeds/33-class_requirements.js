exports.seed = (knex, Promise) => knex('eclassrequirement').del()
    .then(() =>
        knex('eclassrequirement').insert(
            [
                // {
                //     eclasseclassid: 1,
                //     eclassrequirementname: 'Requirement 1',
                //     eclassrequirementcreatetime: Date.now(),
                //     eclassrequirementcreateby: 0
                // },
                // {
                //     eclasseclassid: 1,
                //     eclassrequirementname: 'Requirement 2',
                //     eclassrequirementcreatetime: Date.now(),
                //     eclassrequirementcreateby: 0
                // },
                // {
                //     eclasseclassid: 2,
                //     eclassrequirementname: 'Requirement A',
                //     eclassrequirementcreatetime: Date.now(),
                //     eclassrequirementcreateby: 0
                // },
                // {
                //     eclasseclassid: 2,
                //     eclassrequirementname: 'Requirement B',
                //     eclassrequirementcreatetime: Date.now(),
                //     eclassrequirementcreateby: 0
                // },
                {
                    eclasseclassid: 1,
                    eclassrequirementname: '"D" Coaching Certificate',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 1,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 1,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 1,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 1,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 1,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 2,
                    eclassrequirementname: '"D" Coaching Certificate',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 2,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 2,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 2,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 2,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 2,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 3,
                    eclassrequirementname: '"D" Coaching Certificate',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 3,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 3,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 3,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 3,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 3,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 4,
                    eclassrequirementname: '"D" Coaching Certificate',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 4,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 4,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 4,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 4,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 4,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 5,
                    eclassrequirementname: '"D" Coaching Certificate',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 5,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 5,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 5,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 5,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 5,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 6,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 6,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 6,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 6,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 6,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 7,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 7,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 7,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 7,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 7,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 8,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 8,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 8,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 8,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 8,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 9,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 9,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 9,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 9,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 9,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 10,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 10,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 10,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 10,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 10,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 11,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 11,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 11,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 11,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 11,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 12,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 12,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 12,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 12,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 12,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 13,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 13,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 13,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 13,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 13,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 14,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 14,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 14,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 14,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 14,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 15,
                    eclassrequirementname: 'Current age 18 above',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 15,
                    eclassrequirementname: 'Physically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 15,
                    eclassrequirementname: 'Medically fit',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 15,
                    eclassrequirementname: 'Full course attendance',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
                {
                    eclasseclassid: 15,
                    eclassrequirementname: 'Coaching 6 months Min.',
                    eclassrequirementcreatetime: Date.now(),
                    eclassrequirementcreateby: 0
                },
            ]
        ));
