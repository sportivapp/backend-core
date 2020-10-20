const Model = require('./Model');

class TeamUserMapping extends Model {
    static get tableName() {
        return 'eteamusermapping';
    };

    static get idColumn() {
        return 'eteamusermappingid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                eteameteamid: { type: 'integer' },
                eusereuserid: { type: 'integer' }
            }
        };
    }

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('eteamusermappingid', 'eusereuserid', 'eteameteamid', 'eteamusermappingposition')
            }
        }
    }

    static get relationMappings() {

        const User = require('./User');
        const Team = require('./Team');
        const TeamSportTypeRole = require('./TeamSportTypeRole')

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'eteamusermapping.eusereuserid',
                    to: 'euser.euserid'
                }
            },
            team: {
                relation: Model.BelongsToOneRelation,
                modelClass: Team,
                join: {
                    from: 'eteamusermapping.eteameteamid',
                    to: 'eteam.eteamid'
                }
            },
            teamSportTypeRoles: {
                relation: Model.HasManyRelation,
                modelClass: TeamSportTypeRole,
                join: {

                    from: 'eteamusermapping.eteamusermappingid',
                    to: 'eteamsporttyperoles.eteamusermappingeteamusermappingid',
                }
            }
        }
    }
}

module.exports = TeamUserMapping;