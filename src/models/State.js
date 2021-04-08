const Model = require('./Model');

class State extends Model {
  static get tableName() {
    return 'estate';
  };

  static get idColumn() {
    return 'estateid'
  };
  
  static get modifiers() {
    return {
      baseAttributes(builder) {
          builder.select('estateid', 'estatename')
      },
      timezone(builder) {
        builder.select('estateid', 'estatename', 'estatetimezone');
      }
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['estatename'],
      properties: {
        estatename: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }

  static get relationMappings() {

    const Country = require('./Country')

    return {
      country: {
        relation: Model.BelongsToOneRelation,
        modelClass: Country,
        join: {
            from: 'estate.ecountryecountryid',
            to: 'ecountry.ecountryid'
        }
      }
    }
  }

}

module.exports = State;