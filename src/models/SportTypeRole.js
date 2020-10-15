const Model = require('./Model');

class SportTypeRole extends Model {
    static get tableName() {
        return 'esporttyperole';
    };

    static get idColumn() {
        return 'esporttyperoleid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['esporttyperolename', 'eindustryeindustryid'],
            properties: {
                esporttyperolename: { type: 'string',   minLength: 1, maxLength: 128 },
                eindustryeindustryid: { type: 'integer' }
            }
        };
    }

    static get modifiers () {
        return {
            ...this.baseModifiers(),
            baseAttributes(builder) {
              builder.select('esporttyperoleid', 'esporttyperolename')
            },
        }
    }

    static get relationMappings() {

        // const User = require('./User')
        // const Grades = require('./Grades')

        // return {
        //     user: {
        //         relation: Model.BelongsToOneRelation,
        //         modelClass: User,
        //         join: {
        //             from: 'euserpositionmapping.eusereuserid',
        //             to: 'euser.euserid'
        //         }
        //     },
        //     grade: {
        //         relation: Model.BelongsToOneRelation,
        //         modelClass: Grades,
        //         join: {
        //             from: 'euserpositionmapping.egradeegradeid',
        //             to: 'egrade.egradeid'
        //         }
        //     },
        // }
    }
}

module.exports = SportTypeRole;