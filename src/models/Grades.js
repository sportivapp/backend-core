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
      required: ['egradename'],
      properties: {
        egradename: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }
}

module.exports = Grade;