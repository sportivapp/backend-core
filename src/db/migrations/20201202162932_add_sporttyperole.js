exports.up = (knex, _) => knex.transaction(trx => {
    return knex('esporttyperole')
    .insert(newSportTypeRole())
    .transacting(trx)
    .then(trx.commit)
    .catch(trx.rollback)
})

function newSportTypeRole() {

    return {
        esporttyperolename: 'Center (C)',
        eindustryeindustryid: 3,
        esporttyperolecreatetime: 1603184785402,
        esporttyperolecreateby: 0
    }

}

exports.down = (knex, Promise) => knex('esporttyperole')
    .where('esporttyperolename', 'Center (C)')
    .delete();