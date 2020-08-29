const Model = require('./Model');

class TodoUser extends Model {
    static get tableName() {
        return 'etodouser';
    };

    static get idColumn() {
        return 'etodouserid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {}
        };
    }

    static get relationMappings() {

        const Todo = require('./Todo')
        const User = require('./User')

        return {
            todo: {
                relation: Model.BelongsToOneRelation,
                modelClass: Todo,
                join: {
                    from: 'etodouser.etodoetodoid',
                    to: 'etodo.etodoid'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'etodouser.eusereuserid',
                    to: 'euser.euserid'
                }
            }
        }
    }
}

module.exports = TodoUser;