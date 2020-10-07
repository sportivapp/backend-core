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
}

module.exports = ThreadModerator;