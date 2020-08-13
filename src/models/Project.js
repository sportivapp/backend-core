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
    const User = require('./User')
    const Roster = require('./Roster')

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
      },
      manager: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'eproject.eprojectsupervisorid',
          to: 'euser.euserid'
        }
      },
      units: {
        relation: Model.HasManyRelation,
        modelClass: Roster,
        join: {
          from: 'eproject.eprojectid',
          to: 'eroster.eprojecteprojectid'
        }
      }
    }
  }

  static get modifiers() {
    return {
      ...this.baseModifiers()
    }
  }
}

module.exports = Project;