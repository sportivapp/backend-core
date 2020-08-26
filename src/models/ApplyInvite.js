const Model = require('./Model');

class ApplyInvite extends Model {
    static get tableName() {
        return 'eapplyinvite';
    };

    static get idColumn() {
        return 'eapplyinviteid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                eusereuserid: { type: 'integer' },
                ecompanyecompanyid: { type: 'integer' }
            }
        };
    }

}

module.exports = ApplyInvite;