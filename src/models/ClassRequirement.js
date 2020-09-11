const Model = require('./Model');

class Class extends Model {
    static get tableName() {
        return 'eclassrequirement';
    };

    static get idColumn() {
        return 'eclassrequirementid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {

            }
        };
    }

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('eclassrequirementid',
                    'eclassrequirementname'
                )
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class')

        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'eclassrequirement.eclasseclassid',
                    to: 'eclass.eclassid'
                }
            }
        }
    }
}

module.exports = Class;