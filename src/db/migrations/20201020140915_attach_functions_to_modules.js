exports.up = (knex, _) => knex('efunction')
    .then(functions => modifyFunctions(knex, functions))
    .then(newFunctions => Promise.all(newFunctions))

function modifyFunctions(knex, functions) {

    return functions.map(func => {
        return knex('efunction').where('efunctionid', func.efunctionid)
            .update({ emoduleemoduleid: parseInt(func.efunctioncode.substring(1)) })
    })
}

exports.down = (knex, Promise) => knex('efunction').update({ emoduleemoduleid: null });