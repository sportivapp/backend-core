const Model = require('./Model');

class Department extends Model {
  static get tableName() {
    return 'edepartment';
  };

  static get idColumn() {
    return 'edepartmentid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['edepartmentname', 'edepartmentdescription'],
      properties: {
        edepartmentname: { type: 'string', minLength: 1, maxLength: 256 },
        edepartmentdescription: { type: 'string', minLength: 1, maxLength: 256 },
        edepartmentsuperiorid: { type: 'integer' }
      }
    };
  }

  static get relationMappings() {
    return {
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Department,
        join: {
          from: 'edepartment.edepartmentsuperiorid',
          to: 'edepartment.edepartmentid'
        }
      }
    }
  }
}

module.exports = Department;