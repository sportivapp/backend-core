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

  static get relationMappings() {

    const Project = require('./Project')

    return {
      projects: {
        relation: Model.ManyToManyRelation,
        modelClass: Project,
        join: {
          from: 'edevice.edeviceid',
          through: {
            from: 'eprojectdevicemapping.edevicedeviceid',
            to: 'eprojectdevicemapping.eprojectprojectid'
          },
          to: 'eproject.eprojectid'
        }
      }
    }
  }

  static get modifiers() {
    return {
      notDeleted(builder) {
        builder.where('edevicedeletestatus', 0)
      },
      deleted(builder) {
        builder.where('edevicedeletestatus', 1)
      }
    }
  }

}

module.exports = Device;