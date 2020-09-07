exports.seed = (knex, Promise) => knex('euserpositionmapping').del()
    .then(() =>
        knex('euserpositionmapping').insert(
            [
                {
                    egradeegradeid: 1,
                    eusereuserid: 1,
                    euserpositionmappingcreateby: 0
                },
                {
                  egradeegradeid: 2,
                  eusereuserid: 1,
                  euserpositionmappingcreateby: 0
                },
                {
                  egradeegradeid: 2,
                  eusereuserid: 2,
                  euserpositionmappingcreateby: 0
                },
                {
                  egradeegradeid: 2,
                  eusereuserid: 3,
                  euserpositionmappingcreateby: 0
                },
                {
                  egradeegradeid: 3,
                  eusereuserid: 4,
                  euserpositionmappingcreateby: 0
                },
                {
                  egradeegradeid: 3,
                  eusereuserid: 5,
                  euserpositionmappingcreateby: 0
                },
                {
                  egradeegradeid: 3,
                  eusereuserid: 6,
                  euserpositionmappingcreateby: 0
                },
                {
                  egradeegradeid: 7,
                  eusereuserid: 7,
                  euserpositionmappingcreateby: 0
                },
                {
                  egradeegradeid: 8,
                  eusereuserid: 7,
                  euserpositionmappingcreateby: 0
                },
            ]
      ));
