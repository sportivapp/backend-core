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

  static get relationMappings() {

      const User = require('./User');
      const Industry = require('./Industry');

      return {
          industry: {
              relation: Model.BelongsToOneRelation,
              modelClass: Industry,
              join: {
                  from: 'euserindustrymapping.eindustryeindustryid',
                  to: 'eindustry.eindustryid'
              }
          },
          user: {
              relation: Model.BelongsToOneRelation,
              modelClass: User,
              join: {
                  from: 'euserindustrymapping.eusereuserid',
                  to: 'euser.euserid'
              }
          }
      }
  }

}

module.exports = UserIndustryMapping;