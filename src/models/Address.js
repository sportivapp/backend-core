const Model = require('./Model');

class Address extends Model {
  static get tableName() {
    return 'eaddress';
  };

  static get idColumn() {
    return 'eaddressid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['eaddressstreet', 'eaddresspostalcode'],
      properties: {
        eaddressstreet: { type: 'string', minLength: 1, maxLength: 256 },
        eaddresspostalcode: { type: 'integer' }
      }
    };
  }
}

module.exports = Address;