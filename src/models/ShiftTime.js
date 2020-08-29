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
            required: ['eshifttimename', 'eshifttimestarthour', 'eshifttimestartminute', 'eshifttimeendhour', 'eshifttimeendminute'],
            properties: {
                eshifttimename: { type: 'string', minLength: 1, maxLength: 256 },
                eshifttimestarthour: { type: 'integer' },
                eshifttimestartminute: { type: 'integer' },
                eshifttimeendhour: { type: 'integer' },
                eshifttimeendminute: { type: 'integer' },
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
        const ShiftRosterUserMapping = require('./ShiftRosterUserMapping')

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
            },
            mappings: {
                relation: Model.HasManyRelation,
                modelClass: ShiftRosterUserMapping,
                join: {
                    from: 'eshifttime.eshifttimeid',
                    to: 'eshiftrosterusermapping.eshifttimeeshifttimeid'
                }
            }
        }
    }
}

module.exports = ShiftTime;