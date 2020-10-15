const Model = require('./Model');

class TeamSportTypeRole extends Model {
    static get tableName() {
        return 'eteamsporttyperoles';
    };

    static get idColumn() {
        return 'eteamsporttyperolesid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['eteamusermappingeteamusermappingid', 'esporttyperoleesporttyperoleid', 'eteameteamid'],
            properties: {
                eteamusermappingeteamusermappingid: { type: 'integer' },
                esporttyperoleesporttyperoleid: { type: 'integer' },
                eteameteamid: { type: 'integer' }
            }
        };
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

module.exports = TeamSportTypeRole;