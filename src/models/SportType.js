const Model = require('./Model');

class SportType extends Model {
  static get tableName() {
    return 'esporttype';
  };

  static get idColumn() {
    return 'esporttypeid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['esporttypename'],
      properties: {
        esporttypename: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }

}

module.exports = SportType;