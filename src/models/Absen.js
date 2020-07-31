const Model = require('./Model');

class Absen extends Model {
  static get tableName() {
    return 'eabsen';
  };

  static get idColumn() {
    return 'eabsenid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        eabsenlocationdistanceaccuracy: { type: 'string', minLength: 1, maxLength: 256 },
        eabsenstatus: { type: 'string', minLength: 1, maxLength: 256 },
        eabsendescription: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }
}

module.exports = Absen;