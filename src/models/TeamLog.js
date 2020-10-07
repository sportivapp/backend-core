const Model = require('./Model');

class TeamLog extends Model {
    static get tableName() {
        return 'eteamlog';
    };

    static get idColumn() {
        return 'eteamlogid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                eusereuserid: { type: 'integer' },
                eteameteamid: { type: 'integer' }
            }
        };
    }

    static get modifiers() {
        return {
          baseAttributes(builder) {
            builder.select('eteameteamid', 'eusereuserid', 'eteamlogtype', 'eteamlogstatus')
          }
        }
    }
    
    static get relationMappings() {

        const User = require('./User');
        const Team = require('./Team');

        return {
            team: {
                relation: Model.BelongsToOneRelation,
                modelClass: Team,
                join: {
                    from: 'eteamlog.eteameteamid',
                    to: 'eteam.eteamid'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'eteamlog.eusereuserid',
                    to: 'euser.euserid'
                }
            }
        }
    }

}

module.exports = TeamLog;