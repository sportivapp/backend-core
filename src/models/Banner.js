const Model = require('./Model');

class Banner extends Model {
    static get tableName() {
        return 'ebanner';
    };

    static get idColumn() {
        return 'ebannerid'
    };

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('ebannerstarttime', 'ebannerendtime', 'ebannerstatus')
                    .withGraphFetched('banner(baseAttributes)')
            }
        }
    }

    static get relationMappings() {

        const File = require('./File');

        return {
            banner: {
                relation: Model.BelongsToOneRelation,
                modelClass: File,
                join: {
                    from: 'ebanner.efileefileid',
                    to: 'efile.efileid'
                }
            }
        }
    }

}

module.exports = Banner;