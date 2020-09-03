const Model = require('./Model');

class TeamIndustryMapping extends Model {
  static get tableName() {
    return 'eteamindustrymapping';
  };

  static get idColumn() {
    return 'eteamindustrymappingid'
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

    const Team = require('./Team');
    const Industry = require('./Industry');

    return {
        team: {
            relation: Model.BelongsToOneRelation,
            modelClass: Team,
            join: {
                from: 'eteamindustrymapping.eteameteamid',
                to: 'eteamm.eteamid'
            }
        },
        industry: {
            relation: Model.BelongsToOneRelation,
            modelClass: Industry,
            join: {
                from: 'eteamindustrymapping.eindustryeindustryid',
                to: 'eindustry.eindustryid'
            }
        }
    }
}

}

module.exports = TeamIndustryMapping;