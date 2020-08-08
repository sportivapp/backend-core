exports.seed = (knex, Promise) => knex('eprojectdevicemapping').del()
    .then(() =>
        knex('eprojectdevicemapping').insert(
            [
              {
                  edevicedeviceid: 1,
                  eprojectprojectid: 1,
                  eprojectdevicemappingcreateby: 1
              }
            ]
      ));
