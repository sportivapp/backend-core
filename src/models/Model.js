const objection = require('objection');
const knex = require('../db/config');
const _ = require('lodash');

objection.Model.knex(knex);

class Model extends objection.Model {
  $beforeValidate(jsonSchema, json, opt) {
    return jsonSchema;
  }

  $formatDatabaseJson(json) {
    return _.mapKeys(json, (v, k) => _.snakeCase(k));
  }

  $parseDatabaseJson(json) {
    return _.mapKeys(json, (v, k) => _.camelCase(k));
  }
}

module.exports = Model;