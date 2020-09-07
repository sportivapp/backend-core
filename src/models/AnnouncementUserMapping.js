const Model = require('./Model');

class AnnouncementUserMapping extends Model {
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

  static get relationMappings() {
    return {
      announcement: {
        relation: Model.BelongsToOneRelation,
        modelClass: Announcement,
        join: {
          from: 'eannouncementusermapping.eannouncementeannouncementid',
          to: 'eannouncement.eannouncementid'
        }
      }
    }
  }

}

module.exports = AnnouncementUserMapping;