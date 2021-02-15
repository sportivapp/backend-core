const objection = require('objection');
const CustomQueryBuilder = require('./CustomQueryBuilder');
const knex = require('../../db/config');
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

  static get QueryBuilder() {

    return CustomQueryBuilder
  }

  static baseProperties(tableName) {
    const schema = {}
    return schema
  }

  static baseModifiers() {
    return {
      notDeleted(builder) {
        builder.where('deleteTime')
      },
      deleted(builder) {
        builder.where('deleteTime')
      }
    }
  }
}

module.exports = Model;