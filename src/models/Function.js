const Model = require('./Model');

class Function extends Model {
  static get tableName() {
    return 'efunction';
  };

  static get idColumn() {
    return 'efunctionid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        
      }
    };
  }

  static get relationMappings() {

    const GradeFunctionMapping = require('./GradeFunctionMapping');

    return {
      grade: {
        relation: Model.HasManyRelation,
        modelClass: GradeFunctionMapping,
        join: {
          from: 'efunction.efunctioncode',
          to: 'egradefunctionmapping.efunctionefunctioncode'
        }
      }
    }
  }

}

module.exports = Function;