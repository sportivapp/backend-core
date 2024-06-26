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
    const Department = require('./Department')
    const Function = require('./Function');
    const UserPositionMapping = require('./UserPositionMapping')
    const GradeFunctionMapping = require('./GradeFunctionMapping');

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
      },
      userMappings: {
        relation: Model.HasManyRelation,
        modelClass: UserPositionMapping,
        join: {
          from: 'egrade.egradeid',
          to: 'euserpositionmapping.egradeegradeid'
        }
      },
      department: {
        relation: Model.BelongsToOneRelation,
        modelClass: Department,
        join: {
          from: 'egrade.edepartmentedepartmentid',
          to: 'edepartment.edepartmentid'
        }
      },
      functions: {
        relation: Model.ManyToManyRelation,
        modelClass: Function,
        join: {
          from: 'egrade.egradeid',
          through: {
            from: 'egradefunctionmapping.egradeegradeid',
            to: 'egradefunctionmapping.efunctionefunctioncode'
          },
          to: 'efunction.efunctioncode'
        }        
      }
    }
  }
  
  static get modifiers() {
    return {
      baseAttributes(builder) {
        builder.select('egradeid', 'egradename', 'egradedescription')
      }
    }
  }
}

module.exports = Grade;