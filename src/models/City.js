const Model = require('./Model');

class City extends Model {
  static get tableName() {
    return 'ecity';
  };

  static get idColumn() {
    return 'ecityid'
  };

  static get modifiers() {
    return {
        baseAttributes(builder) {
            builder.select('ecityid', 'ecityname')
        }
    }
}

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ecityname'],
      properties: {
        ecityname: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }
}

module.exports = City;