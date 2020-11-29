exports.up = (knex, Promise) => knex.schema.raw(
    `CREATE UNIQUE INDEX "company_name_unique" ON "ecompany" (lower("ecompanyname"))`
)

exports.down = (knex, Promise) => knex.schema.raw('DROP INDEX "company_name_unique"');