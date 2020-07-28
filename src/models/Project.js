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
        eprojectname: { type: 'string', minLength: 1, maxLength: 256 },
        eprojectstartdate: { type: 'string', format: 'date' },
        eprojectenddate: { type: 'string', format: 'date' },
        eprojectcreateby: { type: 'integer' },
        eprojectaddress: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }
}

module.exports = Project;