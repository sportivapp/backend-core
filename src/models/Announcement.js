const Model = require('./Model');

class Announcement extends Model {
  static get tableName() {
    return 'eannouncement';
  };

  static get idColumn() {
    return 'eannouncementid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['eannouncementtitle','eannouncementcontent'],
      properties: {
        eannouncementtitle: { type: 'string', minLength: 1, maxLength: 256 },
        eannouncementocontent: { type: 'string', minLength: 1, maxLength: 4097 }
      }
    };
  }
}

module.exports = Announcement;