const Model = require('./Model');

class Todo extends Model {
    static get tableName() {
        return 'etodo';
    };

    static get idColumn() {
        return 'etodoid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['etodoname'],
            properties: {
                etodoname: { type: 'string', minLength: 1, maxLength: 256 }
            }
        };
    }

    static get relationMappings() {

        const User = require('./User')
        const Project = require('./Project')
        const ShiftTime = require('./ShiftTime')

        return {
            project: {
                relation: Model.BelongsToOneRelation,
                modelClass: Project,
                join: {
                    from: 'etodo.eprojecteprojectid',
                    to: 'eproject.eprojectid'
                }
            },
            time: {
                relation: Model.BelongsToOneRelation,
                modelClass: ShiftTime,
                join: {
                    from: 'etodo.eshifttimeeshifttimeid',
                    to: 'eshifttime.eshifttimeid'
                }
            },
            creator: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'etodo.etodocreateby',
                    to: 'euser.euserid'
                }
            },
            users: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'etodo.etodoid',
                    through: {
                        from: 'etodouser.etodoetodoid',
                        to: 'etodouser.eusereuserid'
                    },
                    to: 'euser.euserid'
                }
            }
        }
    }
}

module.exports = Todo;