const Model = require('./Model');
const Department = require('./Department');
const User = require('./User')
const RosterUserMapping = require('./RosterUserMapping')

class Roster extends Model {
  static get tableName() {
    return 'eroster';
  };

  static get idColumn() {
    return 'erosterid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['erostername', 'etimesheetetimesheetid'],
      properties: {
        erostername: { type: 'string', minLength: 1, maxLength: 256 },
        erosterdescription: { type: 'string', minLength: 1, maxLength: 256 },
        etimesheetetimesheetid: {type: 'integer' },
        erostersupervisoruserid: {type: 'integer' },
        erosterheaduserid: {type: 'integer' }
      }
    };
  }

  static get relationMappings() {

    return {
      department: {
        relation: Model.BelongsToOneRelation,
        modelClass: Department,
        join: {
          from: 'eroster.edepartmentedepartmentid',
          to: 'edepartment.edepartmentid'
        }
      },
      //nullable supervisor
      supervisor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'eroster.erostersupervisoruserid',
          to: 'euser.euserid'
        }
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'eroster.erosterid',
          through: {
            from: 'erosterusermapping.erostererosterid',
            to: 'erosterusermapping.eusereuserid',
            extra: {
              euseraliasname: 'erosterusermappingname',
              euserjobdescription: 'erosterusermappingjobdescription'
            }
          },
          to: 'euser.euserid'
        }
      },
      mappings: {
        relation: Model.HasManyRelation,
        modelClass: RosterUserMapping,
        join: {
          from: 'eroster.erosterid',
          to: 'erosterusermapping.erostererosterid'
        }
      }
    }
  }

  static get modifiers() {
    return {
      ...this.baseModifiers(),
      baseAttributes(builder) {
        builder.select('erosterid', 'erostername', 'erosterdescription', 'erosteruserlimit', 'erostersupervisoruserid', 'erosterheaduserid')
      },
      idAndName(builder) {
        builder.select('erosterid', 'erostername')
      }
    }
  }
}

module.exports = Roster;