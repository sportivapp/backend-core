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
    const Company = require('./Company');

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
        },
        company: {
          relation: Model.BelongsToOneRelation,
          modelClass: Company,
          join: {
            from: 'eannouncement.ecompanyecompanyid',
            to: 'ecompany.ecompanyid'
          }
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