exports.seed = (knex) =>
    knex('efunction').select()
        .then(funcList => {
            const promises = funcList.map(func => knex('efunction').where({ efunctioncode: func.efunctioncode })
                .first()
                .update({ emoduleemoduleid: parseInt(func.efunctioncode.substring(1)) }))
            return Promise.all(promises)

        })
