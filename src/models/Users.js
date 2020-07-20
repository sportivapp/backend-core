const Model = require('./Model');

class Users extends Model {
  static get tableName() {
    return 'euser';
  };

  static get idColumn() {
    return 'euserid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['eusernik', 'eusername', 'euseremail', 'euserpassword', 'eusermobilenumber'],
      properties: {
        userId: { type: 'int' },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        text: { type: 'string', minLength: 1, maxLength: 255 }
      }
    };
  }
}

module.exports = Users;