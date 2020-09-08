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

  static get relationMappings() {

    const User = require('./User');
    const Industry = require('./Industry');

    return {
        industry: {
            relation: Model.BelongsToOneRelation,
            modelClass: Industry,
            join: {
                from: 'ecoachindustrymapping.eindustryeindustryid',
                to: 'eindustry.eindustryid'
            }
        },
        coach: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'ecoachindustrymapping.eusereuserid',
                to: 'euser.euserid'
            }
        }
    }
}

}

module.exports = CoachIndustryMapping;