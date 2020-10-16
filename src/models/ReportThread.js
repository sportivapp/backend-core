const Model = require('./Model');

class ReportThread extends Model {
    static get tableName() {
        return 'ereportthread';
    };

    static get idColumn() {
        return 'ereportthreadid'
    };

    static get jsonSchema() {}

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('ereportthreadid', 'ereportthreadmessage')
                    .withGraphFetched('thread(baseAttributes)')
                    .withGraphFetched('comment(baseAttributes)')
                    .withGraphFetched('reply(baseAttributes)')
                    .withGraphFetched('reporter(baseAttributes)')
            }
        }
    }

    static get relationMappings() {

        const Thread = require('./Thread')
        const ThreadPost = require('./ThreadPost')
        const ThreadPostReply = require('./ThreadPostReply')
        const User = require('./User')

        return {
            comment: {
                relation: Model.BelongsToOneRelation,
                modelClass: ThreadPost,
                join: {
                    from: 'ereportthread.ethreadpostethreadpostid',
                    to: 'ethreadpost.ethreadpostid'
                }
            },
            reply: {
                relation: Model.BelongsToOneRelation,
                modelClass: ThreadPostReply,
                join: {
                    from: 'ereportthread.ethreadpostreplyethreadpostreplyid',
                    to: 'ethreadpostreply.ethreadpostreplyid'
                }
            },
            thread: {
                relation: Model.BelongsToOneRelation,
                modelClass: Thread,
                join: {
                    from: 'ereportthread.ethreadethreadid',
                    to: 'ethread.ethreadid'
                }
            },
            reporter: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'ereportthread.ereportthreadcreateby',
                    to: 'euser.euserid'
                }
            }
        }

    }
}

module.exports = ReportThread;