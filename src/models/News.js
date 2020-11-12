const Model = require('./Model');

class News extends Model {
    static get tableName() {
        return 'enews'
    };

    static get idColumn() {
        return 'enewsid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['enewstitle', 'enewscontent'],
            properties: {

            }
        };
    }

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('enewsid', 'enewstitle', 'enewscontent', 'enewsdate', 'enewsispublished', 'enewsispublic')
                    .withGraphFetched('file(baseAttributes)')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('company(baseAttributes)')
                    .withGraphFetched('creator(baseAttributes).file(baseAttributes)')
            },
            list(builder) {
                builder.select('enewsid', 'enewstitle', 'enewsdate', 'enewsispublic')
                    .withGraphFetched('file(baseAttributes)')
                    .withGraphFetched('industry(baseAttributes)')
                    .withGraphFetched('company(baseAttributes)')
                    .withGraphFetched('creator(baseAttributes).file(baseAttributes)')
            }
        }
    }

    static get relationMappings() {

        const File = require('./File')
        const Company = require('./Company')
        const User = require('./User')
        const Industry = require('./Industry')

        return {
            file: {
                relation: Model.BelongsToOneRelation,
                modelClass: File,
                join: {
                    from: 'enews.efileefileid',
                    to: 'efile.efileid'
                }
            },
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'enews.ecompanyecompanyid',
                    to: 'ecompany.ecompanyid'
                }
            },
            industry: {
                relation: Model.BelongsToOneRelation,
                modelClass: Industry,
                join: {
                    from: 'enews.eindustryeindustryid',
                    to: 'eindustry.eindustryid'
                }
            },
            creator: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'enews.enewscreateby',
                    to: 'euser.euserid'
                }
            }
        }
    }

}

module.exports = News;