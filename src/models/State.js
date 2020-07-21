const Model = require('./Model');

class Country extends Model {
  static get tableName() {
    return 'estate';
  };

  static get idColumn() {
    return 'estateid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['estatename'],
      properties: {
        estatename: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }
}

module.exports = State;