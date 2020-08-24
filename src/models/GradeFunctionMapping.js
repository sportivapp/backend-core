const Model = require('./Model');

class GradeFunctionMapping extends Model {
  static get tableName() {
    return 'egradefunctionmapping';
  };

  static get idColumn() {
    return 'egradefunctionmappingid'
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

    const Function = require('./Function');

    return {
      function: {
        relation: Model.BelongsToOneRelation,
        modelClass: Function,
        join: {
          from: 'egradefunctionmapping.efunctionefunctioncode',
          to: 'efunction.efunctioncode'
        }
      }
    }
  }
}

module.exports = GradeFunctionMapping;