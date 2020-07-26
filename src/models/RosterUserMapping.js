const Model = require('./Model');

class RosterUserMapping extends Model {
  static get tableName() {
    return 'erosterusermapping';
  };

  static get idColumn() {
    return 'erostererosterid';
  };

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
}

module.exports = RosterUserMapping;