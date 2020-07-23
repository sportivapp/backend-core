const Model = require('./Model');

class UserChangePassword extends Model {
  static get tableName() {
    return 'euser';
  };

  static get idColumn() {
    return 'euserid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['euserpassword'],
      properties: {
        euserpassword: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }
}

module.exports = UserChangePassword;