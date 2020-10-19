const Model = require('./Model');
const { raw } = require('objection')

class ThreadPostReply extends Model {
    static get tableName() {
        return 'ethreadpostreply';
    };

    static get idColumn() {
        return 'ethreadpostreplyid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['ethreadpostreplycomment'],
            properties: {
                ethreadpostreplycomment: { type: 'string', maxLength: 501 }
            }
        }
    }

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('ethreadpostreplyid', 'ethreadpostreplycomment', 'ethreadpostreplycreatetime')
                    .withGraphFetched('user(baseAttributes).file(baseAttributes)')
            }
        }
    }

    static get relationMappings() {

        const ThreadPost = require('./ThreadPost')
        const User = require('./User')
        const ThreadModerator = require('./ThreadModerator')
        const File = require('./File')

        return {
            user: {
                modelClass: User,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: 'ethreadpostreply.ethreadpostreplycreateby',
                    to: 'euser.euserid'
                }
            },
            post: {
                modelClass: ThreadPost,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: 'ethreadpostreply.ethreadpostethreadpostid',
                    to: 'ethreadpost.ethreadpostid'
                }
            },
            moderator: {
                modelClass: ThreadModerator,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: 'ethreadpostreply.ethreadpostreplycreateby',
                    to: 'ethreadmoderator.eusereuserid'
                }
            },
            threadPostReplyPicture: {
                relation: Model.BelongsToOneRelation,
                modelClass: File,
                join: {
                    from: 'ethreadpostreply.efileefileid',
                    to: 'efile.efileid'
                }
            }
        }
    }
}

module.exports = ThreadPostReply;