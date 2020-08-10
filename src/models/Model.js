const objection = require('objection');
const CustomQueryBuilder = require('./CustomQueryBuilder');
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

  static get QueryBuilder() {

    return CustomQueryBuilder
  }

  static baseSchema() {
    const tableName = this.tableName
    const schema = {}
    schema[tableName.concat('createtime')] = { type: 'bigint' }
    schema[tableName.concat('createby')] = { type: 'integer' }
    schema[tableName.concat('changetime')] = { type: 'bigint' }
    schema[tableName.concat('changeby')] = { type: 'integer' }
    schema[tableName.concat('deletetime')] = { type: 'bigint' }
    schema[tableName.concat('deleteby')] = { type: 'integer' }
    schema[tableName.concat('deletestatus')] = { type: 'boolean' }
    return schema
  }

  static baseModifiers() {
    const tableName = this.tableName
    return {
      notDeleted(builder) {
        builder.where(tableName.concat('deletestatus'), false)
      },
      deleted(builder) {
        builder.where(tableName.concat('deletestatus'), true)
      }
    }
  }
}

module.exports = Model;