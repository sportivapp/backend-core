exports.up = (knex, _) => knex.transaction(trx => {
    knex('estate')
        .where('ecountryecountryid', 1)
        .transacting(trx)
        .returning('*')
        .then(states => {
            const updateStateNamePromises = changeStateName(knex, states, trx);
            return Promise.all(updateStateNamePromises);
        })
        .then(trx.commit)
        .catch(trx.rollback)
});

function changeStateName(knex, states, trx) {
    let promises = [];
    states.forEach(state => {
        let newName = '';
        if (state.estatename.includes('DKI Jakarta')) {
            newName = 'Jakarta'
        } else if (state.estatename.includes('DI Yogyakarta')) {
            newName = 'Yogyakarta'
        } else if (state.estatename.includes('Nusa Tenggara Tengah')) {
            newName = 'Nusa Tenggara Timur'
        }

        if (newName !== '') {
            promises.push(knex('estate').where('estateid', state.estateid).update({
                estatename: newName
            }).transacting(trx));
        }   
    });
    return promises;
}

exports.down = (knex, _) => knex.transaction(trx => {
    knex('estate')
    .transacting(trx)
    .returning('*')
    .then(states => {
        const updateStateNamePromises = revertStateName(knex, states, trx);
        return Promise.all(updateStateNamePromises);
    })
    .then(trx.commit)
    .catch(trx.rollback)
});

function revertStateName(knex, states, trx) {
    let promises = [];
    states.forEach(state => {
        let newName = '';
        if (state.estatename.includes('Jakarta')) {
            newName = 'DKI Jakarta'
        } else if (state.estatename.includes('Yogyakarta')) {
            newName = 'DI Yogyakarta'
        } else if (state.estatename.includes('Nusa Tenggara Timur')) {
            newName = 'Nusa Tenggara Tengah'
        }

        if (newName !== '')
            promises.push(knex('estate').where('estateid', state.estateid).update({
                estatename: newName
            })
            .transacting(trx));
    });
    return promises;
}