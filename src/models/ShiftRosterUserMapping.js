const Model = require('./Model');

class ShiftRosterUserMapping extends Model {
    static get tableName() {
        return 'eshiftrosterusermapping';
    };

    static get idColumn() {
        return 'erostererosterid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                erostererosterid: { type: 'integer' },
                eusereuserid: { type: 'integer' },
                eshifttimeeshifttimeid: { type: 'integer' }
            }
        };
    }

    static get relationMappings() {

        const User = require('./User')
        const Roster = require('./Roster')
        const ShiftTime = require('./ShiftTime')

        return {
            user: {
                relation: this.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'eshiftrosterusermapping.eusereuserid',
                    to: 'euser.euserid'
                }
            },
            roster: {
                relation: this.BelongsToOneRelation,
                modelClass: Roster,
                join: {
                    from: 'eshiftrosterusermapping.erostererosterid',
                    to: 'eroster.erosterid'
                }
            },
            shiftTime: {
                relation: this.BelongsToOneRelation,
                modelClass: ShiftTime,
                join: {
                    from: 'eshiftrosterusermapping.eshifttimeeshifttimeid',
                    to: 'eshifttime.eshifttimeid'
                }
            }
        }
    }

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('eshiftdaytime', 'eshiftgeneralstatus', 'erosterusermappingname')
            }
        }
    }
}

module.exports = ShiftRosterUserMapping;