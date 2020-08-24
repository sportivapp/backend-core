const Model = require('./Model');

class ShiftTime extends Model {
    static get tableName() {
        return 'eshifttime';
    };

    static get idColumn() {
        return 'eshifttimeid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['eshifttimename'],
            properties: {
                eshifttimename: { type: 'string', minLength: 1, maxLength: 256 }
            }
        };
    }

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select(
                    'eshifttimeid',
                    'eshifttimename',
                    'eshifttimestarthour',
                    'eshifttimestartminute',
                    'eshifttimeendhour',
                    'eshifttimeendminute'
                )
            }
        }
    }

    static get relationMappings() {

        const Shift = require('./Shift')
        const ShiftPattern = require('./ShiftPattern')

        return {
            shift: {
                relation: Model.BelongsToOneRelation,
                modelClass: Shift,
                join: {
                    from: 'eshifttime.eshifteshiftid',
                    to: 'eshift.eshiftid'
                }
            },
            pattern: {
                relation: Model.BelongsToOneRelation,
                modelClass: ShiftPattern,
                join: {
                    from: 'eshifttime.eshiftpatterneshiftpatternid',
                    to: 'eshiftpattern.eshiftpatternid'
                }
            }
        }
    }
}

module.exports = ShiftTime;