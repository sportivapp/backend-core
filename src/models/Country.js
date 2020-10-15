const Model = require('./Model');

class Country extends Model {
  static get tableName() {
    return 'ecountry';
  };

  static get idColumn() {
    return 'ecountryid'
  };

  static get modifiers() {
    return {
        baseAttributes(builder) {
            builder.select('ecountryid', 'ecountryname')
        }
    }
}

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ecountryname'],
      properties: {
        ecountryname: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }
}

module.exports = Country;