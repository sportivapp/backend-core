const Model = require('./Model');
const Announcement = require('./Announcement')

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

    const Announcement = require('./Announcement');
    
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