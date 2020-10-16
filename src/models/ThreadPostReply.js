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
                ethreadpostreplycomment: { type: 'string', minLength: 1, maxLength: 501 }
            }
        }
    }

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('ethreadpostreplycomment', 'ethreadpostreplycreatetime')
            }
        }
    }

    static get relationMappings() {

        const ThreadPost = require('./ThreadPost')
        const User = require('./User')
        const ThreadModerator = require('./ThreadModerator')

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
            file: {
                relation: Model.BelongsToOneRelation,
                modelClass: File,
                join: {
                    from: 'ethread.efileefileid',
                    to: 'efile.efileid'
                }
            }
        }
    }
}

module.exports = ThreadPostReply;