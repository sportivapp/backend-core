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
        eprojectstartdate: { type: 'bigint' },
        eprojectenddate: { type: 'bigint' },
        eprojectcreateby: { type: 'integer' },
        eprojectaddress: { type: 'string', minLength: 1, maxLength: 256 }
      }
    }
  }

  static get relationMappings() {

    const Device = require('./Device')
    const User = require('./User')
    const Roster = require('./Roster')
    const Timesheet = require('./Timesheet')
    const Todo = require('./Todo')

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
      },
      timesheets: {
        relation: Model.ManyToManyRelation,
        modelClass: Timesheet,
        join: {
          from: 'eproject.eprojectid',
          through: {
            from: 'eprojecttimesheetmapping.eprojecteprojectid',
            to: 'eprojecttimesheetmapping.etimesheetetimesheetid'
          },
          to: 'etimesheet.etimesheetid'
        }
      },
      todos: {
        relation: Model.HasManyRelation,
        modelClass: Todo,
        join: {
          from: 'eproject.eprojectid',
          to: 'etodo.eprojecteprojectid'
        }
      },
    }
  }

  static get modifiers() {
    return {
      ...this.baseModifiers(),
      baseAttributes(builder) {
        builder.select('eprojectname', 'eprojectcode', 'eprojectstartdate', 'eprojectenddate', 'eprojectdescription', 'eprojectaddress')
      }
    }
  }
}

module.exports = Project;