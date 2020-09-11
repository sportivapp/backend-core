const Model = require('./Model');

class MobileAppVersion extends Model {
  static get tableName() {
    return 'emobileappversion';
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
      }
    };
  }
}

module.exports = MobileAppVersion;