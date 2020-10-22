exports.up = (knex, Promise) => knex.schema.raw('ALTER TABLE "ethread" DROP CONSTRAINT "ethread_ethreadtitle_unique";')
    .then(() => knex.schema.raw(
    `CREATE UNIQUE INDEX "forum_name_companyId_unique" ON "ethread" (lower("ethreadtitle"), "ecompanyecompanyid") WHERE "eteameteamid" IS NULL AND "ecompanyecompanyid" IS NOT NULL`
)).then(() => knex.schema.raw(
    `CREATE UNIQUE INDEX "forum_name_teamId_unique" ON "ethread" (lower("ethreadtitle"), "eteameteamid") WHERE "ecompanyecompanyid" IS NULL AND "eteameteamid" IS NOT NULL`
)).then(() => knex.schema.raw(
        `CREATE UNIQUE INDEX "forum_name_userId_unique" ON "ethread" (lower("ethreadtitle")) WHERE "ecompanyecompanyid" IS NULL AND "eteameteamid" IS NULL`
    ));

exports.down = (knex, Promise) => knex.schema.raw('DROP INDEX "forum_name_userId_unique", "forum_name_teamId_unique", "forum_name_companyId_unique"');