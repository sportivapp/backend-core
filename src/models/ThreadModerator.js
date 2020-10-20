const Model = require('./Model');

class ThreadModerator extends Model {
  static get tableName() {
    return 'ethreadmoderator';
  };

  static get idColumn() {
    return 'ethreadmoderatorid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
      }
    }
  }

  static get relationMappings() {

    const User = require('./User')

    return {
      user: {
        modelClass: User,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'ethreadmoderator.eusereuserid',
          to: 'euser.euserid'
        }
      }
    }
  }
}

module.exports = ThreadModerator;