const Model = require('./Model');
const Company = require('./Company');
const TeamUserMapping = require('./TeamUserMapping');

class Team extends Model {
    static get tableName() {
        return 'eteam';
    };

    static get idColumn() {
        return 'eteamid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {

            }
        };
    }

    static get relationMappings() {

        const User = require('./User')

        return {
            position: {
                relation: Model.HasManyRelation,
                modelClass: TeamUserMapping,
                join: {
                    from: 'eteam.eteamid',
                    // through: {
                    //     from: 'eteamusermapping.eteameteamid',
                    //     to: 'eteamusermapping.eusereuserid'
                    // },
                    to: 'eteamusermapping.eteameteamid'
                }
            },
            members: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'eteam.eteamid',
                    through: {
                        from: 'eteamusermapping.eteameteamid',
                        to: 'eteamusermapping.eusereuserid'
                    },
                    to: 'euser.euserid'
                }
            },
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'eteam.ecompanyecompanyid',
                    to: 'ecompany.ecompanyid'
                }
            }
        }
    }
}

module.exports = Team;