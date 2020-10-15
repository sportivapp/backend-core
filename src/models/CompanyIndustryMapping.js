const Model = require('./Model');

class CompanyIndustryMapping extends Model {
  static get tableName() {
    return 'ecompanyindustrymapping';
  };

  static get idColumn() {
    return 'ecompanyindustrymappingid'
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

    const Company = require('./Company');
    const Industry = require('./Industry');

    return {
        company: {
            relation: Model.BelongsToOneRelation,
            modelClass: Company,
            join: {
                from: 'ecompanyindustrymapping.ecompanyecompanyid',
                to: 'ecompany.ecompanyid'
            }
        },
        industry: {
            relation: Model.BelongsToOneRelation,
            modelClass: Industry,
            join: {
                from: 'ecompanyindustrymapping.eindustryeindustryid',
                to: 'eindustry.eindustryid'
            }
        }
    }
}

}

module.exports = CompanyIndustryMapping;