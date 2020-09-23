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

    static get relationMappings() {

        const File = require('./File')
        const Company = require('./Company')

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
                    from: 'enews.ecompanycompanyid',
                    to: 'ecompany.ecompanyid'
                }
            }
        }
    }

}

module.exports = News;