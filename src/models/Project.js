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
      required: [],
      properties: {
        
      }
    };
  }
}

module.exports = Project;