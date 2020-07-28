const Model = require('./Model');

class RosterUserMapping extends Model {
  static get tableName() {
    return 'eannouncementusermapping';
  };

  static get idColumn() {
    return 'eannouncementeannouncementid';
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        eannouncementeannouncementid: { type: 'integer' },
        eusereuserid: { type: 'integer' }
      }
    };
  }
}

module.exports = RosterUserMapping;