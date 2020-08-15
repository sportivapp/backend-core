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
      required: ['egradename', 'egradedescription', 'ecompanyecompanyid'],
      properties: {
        egradename: { type: 'string', minLength: 1, maxLength: 256 },
        egradedescription: { type: 'string', minLength: 1, maxLength: 256 }
      }
    }
  }

  static get relationMappings() {

    const Company = require('./Company')
    const User = require('./User')

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
          from: 'egrade.ecompanyecompanyid',
          to: 'ecompany.ecompanyid'
        }
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'egrade.egradeid',
          through: {
            from: 'euserpositionmapping.egradeegradeid',
            to: 'euserpositionmapping.eusereuserid'
          },
          to: 'euser.euserid'
        }
      }
    }
  }
  
  static get modifiers() {
    return {
      findByDeleteStatus(query, deleteStatus) {
        if (!deleteStatus) query.where('egradedeletestatus', false)
        else query.where('egradedeletestatus', deleteStatus)
      }
    }
  }
}

module.exports = Grade;