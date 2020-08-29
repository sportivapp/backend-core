const Model = require('./Model');

class RosterUserMapping extends Model {
  static get tableName() {
    return 'erosterusermapping';
  };

  static get idColumn() {
    return 'erostererosterid';
  };

  static get relationMappings() {

    const User = require('./User')
    const Roster = require('./Roster')

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'erosterusermapping.eusereuserid',
          to: 'euser.euserid'
        }
      },
      roster: {
        relation: Model.BelongsToOneRelation,
        modelClass: Roster,
        join: {
          from: 'erosterusermapping.erostererosterid',
          to: 'eroster.erosterid'
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        erostererosterid: { type: 'integer' },
        eusereuserid: { type: 'integer' }
      }
    };
  }

  static get modifiers() {
    return {
      baseAttributes(builder) {
        builder.select('erosterusermappingname', 'erosterusermappingjobdescription', 'erosterusermappingtype')
      }
    }
  }
}

module.exports = RosterUserMapping;