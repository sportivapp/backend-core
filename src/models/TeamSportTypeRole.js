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

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('eteamsporttyperolesid', 'eteamusermappingeteamusermappingid', 'esporttyperoleesporttyperoleid', 'eteameteamid')
                .withGraphFetched('sportTypeRole(baseAttributes)')
            }
        }
    }

    static get relationMappings() {

        const SportTypeRole = require('./SportTypeRole')

        return {
            sportTypeRole: {
                relation: Model.BelongsToOneRelation,
                modelClass: SportTypeRole,
                join: {
                    from: 'eteamsporttyperoles.esporttyperoleesporttyperoleid',
                    to: 'esporttyperole.esporttyperoleid'
                }
            }
        }
    }
}

module.exports = TeamSportTypeRole;