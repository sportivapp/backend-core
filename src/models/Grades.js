const Model = require('./Model');

class Grade extends Model {
  static get tableName() {
    return 'egrade';
  };

  static get idColumn() {
    return 'egradeid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['egradename', 'egradedescription', 'ecompanycompanyid'],
      properties: {
        egradename: { type: 'string', minLength: 1, maxLength: 256 },
        egradedescription: { type: 'string', minLength: 1, maxLength: 256 }
      }
    }
  }

  static get relationMappings() {

    const Company = require('./Company')

    return {
      superior: {
        relation: Model.BelongsToOneRelation,
        modelClass: Grade,
        join: {
          from: 'egrade.egradesuperiorid',
          to: 'egrade.egradeid'
        }
      },
      subordinates: {
        relation: Model.HasManyRelation,
        modelClass: Grade,
        join: {
          from: 'egrade.egradeid',
          to: 'egrade.egradesuperiorid'
        }
      },
      company: {
        relation: Model.BelongsToOneRelation,
        modelClass: Company,
        join: {
          from: 'egrade.ecompanycompanyid',
          to: 'ecompany.ecompanyid'
        }
      }
    }
  }
}

module.exports = Grade;