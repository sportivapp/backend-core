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

    const Grades = require('./Grades')

    return {
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Department,
        join: {
          from: 'edepartment.edepartmentsuperiorid',
          to: 'edepartment.edepartmentid'
        }
      },
      childrens: {
        relation: Model.HasManyRelation,
        modelClass: Department,
        join: {
          from: 'edepartment.edepartmentid',
          to: 'edepartment.edepartmentsuperiorid'
        }
      },
      positions: {
        relation: Model.HasManyRelation,
        modelClass: Grades,
        join: {
          from: 'edepartment.edepartmentid',
          to: 'egrade.edepartmentedepartmentid'
        }
      }
    }
  }
}

module.exports = Department;