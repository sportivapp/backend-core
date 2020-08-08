const Model = require('./Model');

class Project extends Model {
  static get tableName() {
    return 'eproject';
  };

  static get idColumn() {
    return 'eprojectid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['eprojectname', 'eprojectcode', 'eprojectstartdate', 'eprojectenddate', 'eprojectcreateby'],
      properties: {
        eprojectname: { type: 'string', minLength: 1, maxLength: 256 },
        eprojectcode: { type: 'string', minLength: 1, maxLength: 256 },
        eprojectstartdate: { type: 'string', format: 'date' },
        eprojectenddate: { type: 'string', format: 'date' },
        eprojectcreateby: { type: 'integer' },
        eprojectaddress: { type: 'string', minLength: 1, maxLength: 256 }
      }
    }
  }

  static get relationMappings() {

    const Device = require('./Device')

    return {
      devices: {
        relation: Model.ManyToManyRelation,
        modelClass: Device,
        join: {
          from: 'eproject.eprojectid',
          through: {
            from: 'eprojectdevicemapping.eprojectprojectid',
            to: 'eprojectdevicemapping.edevicedeviceid'
          },
          to: 'edevice.edeviceid'
        }
      }
    }
  }

  static get modifiers() {
    return {
      notDeleted(builder) {
        builder.where('eprojectdeletestatus', false)
      },
      deleted(builder) {
        builder.where('eprojectdeletestatus', true)
      }
    }
  }
}

module.exports = Project;