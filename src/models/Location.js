const Model = require('./Model');

class Location extends Model {
  static get tableName() {
    return 'elocation';
  };

  static get idColumn() {
    return 'elocationid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['elocationcode', 'elocationlongitude', 'elocationlatitude', 'elocationcreateby'],
      properties: {
        elocationcode: { type: 'string', minLength: 1, maxLength: 7 },
        elocationname: { type: 'string', minLength: 1, maxLength: 256 },
        elocationdescription: { type: 'string', minLength: 1, maxLength: 256 },
        elocationlongitude: { type: 'string', minLength: 1, maxLength: 51 },
        elocationlatitude: { type: 'string', minLength: 1, maxLength: 51 },
        elocationaddress: { type: 'string', minLength: 1, maxLength: 256 },
        elocationcreateby: { type: 'integer' }
      }
    };
  }
}

module.exports = Location;