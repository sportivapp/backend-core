const Model = require('./Model');

class UserPositionMapping extends Model {
    static get tableName() {
        return 'euserpositionmapping';
    };

    static get idColumn() {
        return 'eusereuserid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                eusereuserid: { type: 'integer' },
                egradeegradeid: { type: 'integer' }
            }
        };
    }

    static get relationMappings() {

        const User = require('./User')
        const Grades = require('./Grades')

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'euserpositionmapping.eusereuserid',
                    to: 'euser.euserid'
                }
            },
            grade: {
                relation: Model.BelongsToOneRelation,
                modelClass: Grades,
                join: {
                    from: 'euserpositionmapping.egradeegradeid',
                    to: 'egrade.egradeid'
                }
            },
        }
    }
}

module.exports = UserPositionMapping;