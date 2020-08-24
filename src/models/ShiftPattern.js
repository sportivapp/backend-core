const Model = require('./Model');

class ShiftPattern extends Model {
    static get tableName() {
        return 'eshiftpattern';
    };

    static get idColumn() {
        return 'eshiftpatternid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                eshiftpatternname: { type: 'string', minLength: 1, maxLength: 256 }
            }
        };
    }

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('eshiftpatternid', 'eshiftpatternstarttime', 'eshiftpatternendtime')
            }
        }
    }

    static get relationMappings() {

        const Shift = require('./Shift')
        const ShiftTime = require('./ShiftTime')

        return {
            shift: {
                relation: Model.BelongsToOneRelation,
                modelClass: Shift,
                join: {
                    from: 'eshiftpattern.eshifteshiftid',
                    to: 'eshift.eshiftid'
                }
            },
            times: {
                relation: Model.HasManyRelation,
                modelClass: ShiftTime,
                join: {
                    from: 'eshiftpattern.epatternid',
                    to: 'eshifttime.eshiftpatterneshiftpatternid'
                }
            }
        }
    }
}

module.exports = ShiftPattern;