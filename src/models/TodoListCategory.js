const Model = require('./Model');

class TodoListCategory extends Model {
    static get tableName() {
        return 'etodolistcategory';
    };

    static get idColumn() {
        return 'etodolistcategoryid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['etodolistcategoryname'],
            properties: {
                etodolistcategoryname: { type: 'string', minLength: 1, maxLength: 256 }
            }
        };
    }

    static get relationMappings() {

        const Todo = require('./Todo')
        const User = require('./User')

        return {
            todos: {
                relation: Model.HasManyRelation,
                modelClass: Todo,
                join: {
                    from: 'etodolistcategory.etodolistcategoryid',
                    to: 'etodo.etodolistcategoryetodolistcategoryid'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'etodolistcategory.eusereuserid',
                    to: 'euser.euserid'
                }
            }
        }
    }
}

module.exports = TodoListCategory;