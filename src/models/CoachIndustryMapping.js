const Model = require('./Model');

class CoachIndustryMapping extends Model {
  static get tableName() {
    return 'ecoachindustrymapping';
  };

  static get idColumn() {
    return 'ecoachindustrymappingid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
      }
    }
  }

}

module.exports = CoachIndustryMapping;