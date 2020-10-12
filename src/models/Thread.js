const Model = require('./Model');

class Thread extends Model {
  static get tableName() {
    return 'ethread';
  };

  static get idColumn() {
    return 'ethreadid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ethreadtitle', 'ethreadispublic'],
      properties: {
        ethreadtitle: { type: 'string', minLength: 1, maxLength: 256 },
        ethreadispublic: { type: 'boolean' },
      }
    }
  }

  static get modifiers() {
    return {
      baseAttributes(builder) {
        builder.select('ethreadid',
            'ethreadtitle',
            'ethreaddescription',
            'ethreadispublic',
            'ecompanyecompanyid',
            'eteameteamid',
            'ethreadlock',
            'ethreadcreatetime',
            'ethreadcreateby')
      }
    }
  }

  static get relationMappings() {
  
    const ThreadPost = require('./ThreadPost')
    const Company = require('./Company')
    const Team = require('./Team')
    const ThreadModerator = require('./ThreadModerator')
    const User = require('./User')

    return {
      comments: {
        relation: Model.HasManyRelation,
        modelClass: ThreadPost,
        join: {
          from: 'ethread.ethreadid',
          to: 'ethreadpost.ethreadethreadid'
        }
      },
      company: {
        relation: Model.BelongsToOneRelation,
        modelClass: Company,
        join: {
          from: 'ethread.ecompanyecompanyid',
          to: 'ecompany.ecompanyid'
        }
      },
      team: {
        relation: Model.BelongsToOneRelation,
        modelClass: Team,
        join: {
          from: 'ethread.eteameteamid',
          to: 'eteam.eteamid'
        }
      },
      moderators: {
        relation: Model.HasManyRelation,
        modelClass: ThreadModerator,
        join: {
          from: 'ethread.ethreadid',
          to: 'ethreadmoderator.ethreadethreadid'
        }
      },
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'ethread.ethreadcreateby',
          to: 'euser.euserid'
        }
      }
    }

  }
}

module.exports = Thread;