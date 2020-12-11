exports.up = (knex, _) => Promise.all([alterThreadPostTable(knex, false), alterThreadPostReplyTable(knex, false)])

function alterThreadPostTable(knex, isRollback) {
    if (isRollback)
        return knex.schema.alterTable('ethreadpost', t => {
        t.dropColumn('ethreadpostdeletestatus')
        t.dropColumn('ethreadpostdeletetime');
        t.dropColumn('ethreadpostdeleteby');
        })

    return knex.schema.alterTable('ethreadpost', t => {
        t.boolean('ethreadpostdeletestatus').defaultTo(false)
        t.bigInteger('ethreadpostdeletetime');
        t.integer('ethreadpostdeleteby');
    })
}

function alterThreadPostReplyTable(knex, isRollback) {
    if (isRollback)
        return knex.schema.alterTable('ethreadpostreply', t => {
            t.dropColumn('ethreadpostreplydeletestatus')
            t.dropColumn('ethreadpostreplydeletetime');
            t.dropColumn('ethreadpostreplydeleteby');
        })

    return knex.schema.alterTable('ethreadpostreply', t => {
        t.boolean('ethreadpostreplydeletestatus').defaultTo(false)
        t.bigInteger('ethreadpostreplydeletetime');
        t.integer('ethreadpostreplydeleteby');
    })
}

exports.down = (knex, _) => Promise.all([alterThreadPostTable(knex, true), alterThreadPostReplyTable(knex, true)])