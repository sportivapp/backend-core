exports.up = (knex, Promise) => deleteIndex(knex)
    .then(() => knex.schema.raw(
        `CREATE UNIQUE INDEX "forum_name_companyId_unique" ON "ethread" (lower("ethreadtitle"), "ecompanyecompanyid", "ethreaddeletestatus") WHERE "eteameteamid" IS NULL AND "ecompanyecompanyid" IS NOT NULL`
    ))
    .then(() => knex.schema.raw(
        `CREATE UNIQUE INDEX "forum_name_teamId_unique" ON "ethread" (lower("ethreadtitle"), "eteameteamid", "ethreaddeletestatus") WHERE "ecompanyecompanyid" IS NULL AND "eteameteamid" IS NOT NULL`
    )).then(() => knex.schema.raw(
        `CREATE UNIQUE INDEX "forum_name_userId_unique" ON "ethread" (lower("ethreadtitle"), "ethreaddeletestatus") WHERE "ecompanyecompanyid" IS NULL AND "eteameteamid" IS NULL`
    ))

function deleteIndex(knex) {
    return knex.schema.raw('DROP INDEX "forum_name_userId_unique", "forum_name_teamId_unique", "forum_name_companyId_unique"')
}

exports.down = (knex, Promise) => deleteIndex(knex);