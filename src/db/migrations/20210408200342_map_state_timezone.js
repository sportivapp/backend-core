exports.up = (knex, _) => knex.transaction(trx => {
    knex('estate')
        .where('ecountryecountryid', 1)
        .transacting(trx)
        .returning('*')
        .then(states => {
            const addMappingPromises = mapStatesTimezone(knex, states, trx);
            return Promise.all(addMappingPromises);
        })
        .then(trx.commit)
        .catch(trx.rollback)
});

function mapStatesTimezone(knex, states, trx) {
    let promises = [];
    states.forEach(state => {
        let timezone = '';
        if (state.estatename.includes('Banten')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Bali')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Aceh')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Bengkulu')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Bangka Belitung')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Jawa Timur')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Jawa Tengah')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Jawa Barat')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Nusa Tenggara Timur')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Nusa Tenggara Barat')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Gorontalo')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Jakarta')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Jambi')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Lampung')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Maluku')) {
            timezone = 'Asia/Jayapura';
        } else if (state.estatename.includes('Maluku Utara')) {
            timezone = 'Asia/Jayapura';
        } else if (state.estatename.includes('Sulawesi Utara')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Sulawesi Tengah')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Sulawesi Tenggara')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Sulawesi Barat')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Sulawesi Selatan')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Sumatera Utara')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Sumatera Selatan')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Sumatera Barat')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Riau')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Kepulauan Riau')) {
            timezone = 'Asia/Jakarta';
        } else if (state.estatename.includes('Kalimantan Barat')) {
            timezone = 'Asia/Pontianak';
        } else if (state.estatename.includes('Kalimantan Timur')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Kalimantan Selatan')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Kalimantan Utara')) {
            timezone = 'Asia/Makassar';
        } else if (state.estatename.includes('Kalimantan Tengah')) {
            timezone = 'Asia/Pontianak';
        } else if (state.estatename.includes('Papua Barat')) {
            timezone = 'Asia/Jayapura';
        } else if (state.estatename.includes('Papua')) {
            timezone = 'Asia/Jayapura';
        } else if (state.estatename.includes('Yogyakarta')) {
            timezone = 'Asia/Jakarta';
        }

        if (timezone !== '')
            promises.push(knex('estate').where('estateid', state.estateid).update({
                estatetimezone: timezone
            }).transacting(trx));
    });
    return promises;
}

exports.down = (knex, _) => knex.transaction(trx => {
    knex('estate')
    .update({
        estatetimezone: null,
    })
    .transacting(trx)
    .returning('*')
    .then(trx.commit)
    .catch(trx.rollback)
});