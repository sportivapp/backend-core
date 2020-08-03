const Model = require('./Model');

class Device extends Model {
  static get tableName() {
    return 'edevice';
  };

  static get idColumn() {
    return 'edeviceid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['edeviceidinfo'],
      properties: {
        edeviceidinfo: { type: 'string', minLength: 1, maxLength: 256 },
        edeviceimei: { type: 'string', minLength: 1, maxLength: 17 }
      }
    }
  }
}

module.exports = Device;