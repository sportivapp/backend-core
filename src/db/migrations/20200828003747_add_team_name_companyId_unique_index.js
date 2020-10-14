exports.up = (knex, Promise) => knex.schema.raw(
    `CREATE UNIQUE INDEX "team_name_companyId_unique" ON "eteam" ("ecompanyecompanyid", lower("eteamname")) WHERE "ecompanyecompanyid" IS NOT NULL`
).then(() => knex.schema.raw(
    `CREATE UNIQUE INDEX "team_name_unique" ON "eteam" (lower("eteamname")) WHERE "ecompanyecompanyid" IS NULL`
));

exports.down = (knex, Promise) => knex.schema.raw('DROP INDEX "team_name_companyId_unique", "team_name_unique"');