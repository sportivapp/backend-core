const Model = require('./Model');

class Timesheet extends Model {
    static get tableName() {
        return 'etimesheet';
    };

    static get idColumn() {
        return 'etimesheetid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['etimesheetname'],
            properties: {
                etimesheetname: { type: 'string', minLength: 1, maxLength: 256 }
            }
        };
    }

    static get relationMappings () {

        const Shift = require('./Shift')
        const Roster = require('./Roster')

        return {
            shift: {
                relation: Model.BelongsToOneRelation,
                modelClass: Shift,
                join: {
                    from: 'etimesheet.eshifteshiftid',
                    to: 'eshift.eshiftid'
                }
            },
            rosters: {
                relation: Model.HasManyRelation,
                modelClass: Roster,
                join: {
                    from: 'etimesheet.etimesheetid',
                    to: 'eroster.etimesheetetimesheetid'
                }
            }
        }
    }
}

module.exports = Timesheet;