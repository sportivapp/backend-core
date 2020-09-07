const Model = require('./Model');

class ProjectTimesheetMapping extends Model {
    static get tableName() {
        return 'eprojecttimesheetmapping';
    };

    static get idColumn() {
        return 'eprojecteprojectid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                eprojecteprojectid: { type: 'integer' },
                etimesheetetimesheetid: { type: 'integer' }
            }
        };
    }

    static get relationMappings() {

        const Project = require('./Project')
        const Timesheet = require('./Timesheet')

        return {
            project: {
                relation: this.BelongsToOneRelation,
                modelClass: Project,
                join: {
                    from: 'eprojecttimesheetmapping.eprojecteprojectid',
                    to: 'eproject.eprojectid'
                }
            },
            timesheet: {
                relation: this.BelongsToOneRelation,
                modelClass: Timesheet,
                join: {
                    from: 'eprojecttimesheetmapping.etimesheetetimesheetid',
                    to: 'etimesheet.etimesheetid'
                }
            },
        }
    }
}

module.exports = ProjectTimesheetMapping;