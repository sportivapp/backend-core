const Model = require('./Model');

class Experience extends Model {
  static get tableName() {
    return 'eexperience';
  };

  static get idColumn() {
    return 'eexperienceid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['eexperiencename', 'eexperiencestartdate'],
      properties: {
        eexperiencename: { type: 'string', minLength: 1, maxLength: 65 },
        eexperiencestartdate: { type: 'integer'},
        eexperienceenddate: { type: 'integer'},
        eexperiencelocation: { type: 'string', minLength: 1, maxLength: 65 },
        eexperienceposition: { type: 'string', minLength: 1, maxLength: 65 },
        eexperiencedescription: { type: 'string', minLength: 1, maxLength: 1025 },
      }
    }
  }

  static get relationMappings() {

    const Industry = require('./Industry')

    return {
      industries: {
        relation: Model.BelongsToOneRelation,
        modelClass: Industry,
        join: {
          from: 'eexperience.eindustryeindustryid',
          to: 'eindustry.eindustryid'
        }
      }
    }
  }

}

module.exports = Experience;