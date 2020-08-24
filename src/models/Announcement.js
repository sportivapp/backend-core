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

  static get relationMappings() {

    const User = require('./User');

    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
            from: 'eannouncement.eannouncementid',
            through: {
              from: 'eannouncementusermapping.eannouncementeannouncementid',
              to: 'eannouncementusermapping.eusereuserid'
            },
            to: 'euser.euserid'
        }
      },
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'eannouncement.eannouncementcreateby',
          to: 'euser.euserid'
        }
      }
  }
}

}

module.exports = Announcement;