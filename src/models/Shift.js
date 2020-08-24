const Model = require('./Model');

class Shift extends Model {
    static get tableName() {
        return 'eshift';
    };

    static get idColumn() {
        return 'eshiftid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['eshiftname'],
            properties: {
                eshiftname: { type: 'string', minLength: 1, maxLength: 256 }
            }
        };
    }

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('eshiftid', 'eshiftname', 'eshiftstartdate', 'eshiftenddate')
            }
        }
    }

    static get relationMappings() {

        const ShiftPattern = require('./ShiftPattern')

        return {
            patterns: {
                relation: Model.HasManyRelation,
                modelClass: ShiftPattern,
                join: {
                    from: 'eshift.eshiftid',
                    to: 'eshiftpattern.eshifteshiftid'
                }
            }
        }
    }
}

module.exports = Shift;