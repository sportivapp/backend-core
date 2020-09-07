const Model = require('./Model');

class AnnouncementDelete extends Model {
  static get tableName() {
    return 'eannouncement';
  };

  static get idColumn() {
    return 'eannouncementid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {}
    };
  }
}

module.exports = AnnouncementDelete;