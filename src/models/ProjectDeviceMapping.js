const Model = require('./Model');

class ProjectDeviceMapping extends Model {
    static get tableName() {
        return 'eprojectdevicemapping';
    };

    static get idColumn() {
        return 'eprojectprojectid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                eprojectprojectid: { type: 'integer' },
                edevicedeviceid: { type: 'integer' }
            }
        };
    }
}

module.exports = ProjectDeviceMapping