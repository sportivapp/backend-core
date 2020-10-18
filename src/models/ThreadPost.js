const Model = require('./Model');

class ThreadPost extends Model {
  static get tableName() {
    return 'ethreadpost';
  };

  static get idColumn() {
    return 'ethreadpostid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ethreadpostcomment'],
      properties: {
        ethreadpostcomment: { type: 'string', minLength: 1, maxLength: 501 }
      }
    }
  }

  static get modifiers() {
    return {
      baseAttributes(builder) {
        builder.select('ethreadpostid', 'ethreadpostcomment', 'ethreadpostcreatetime')
            .withGraphFetched('user(baseAttributes).file(baseAttributes)')
      }
    }
  }

  static get relationMappings() {

    const Thread = require('./Thread')
    const User = require('./User')
    const File = require('./File')
    const ThreadModerator = require('./ThreadModerator')
    const ThreadPostReply = require('./ThreadPostReply')

    return {
      thread: {
        modelClass: Thread,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'ethreadpost.ethreadethreadid',
          to: 'ethread.ethreadid'
        }
      },
      user: {
        modelClass: User,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'ethreadpost.ethreadpostcreateby',
          to: 'euser.euserid'
        }
      },
      moderator: {
        modelClass: ThreadModerator,
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'ethreadpost.ethreadpostcreateby',
          to: 'ethreadmoderator.eusereuserid'
        },
      },
      replies: {
        modelClass: ThreadPostReply,
        relation: Model.HasManyRelation,
        join: {
          from: 'ethreadpost.ethreadpostid',
          to: 'ethreadpostreply.ethreadpostethreadpostid'
        }
      },
      threadPostPicture: {
        relation: Model.BelongsToOneRelation,
        modelClass: File,
        join: {
          from: 'ethreadpost.efileefileid',
          to: 'efile.efileid'
        }
      }
    }
  }
}

module.exports = ThreadPost;