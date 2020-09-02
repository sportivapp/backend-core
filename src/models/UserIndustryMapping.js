const Model = require('./Model');

class UserIndustryMapping extends Model {
  static get tableName() {
    return 'euserindustrymapping';
  };

  static get idColumn() {
    return 'euserindustrymappingid'
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

module.exports = UserIndustryMapping;