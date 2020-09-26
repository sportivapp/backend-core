const Model = require('./Model');
const { ManyToManyRelation } = require('./Model');

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
        eexperiencelocation: { type: 'string', minLength: 1, maxLength: 65 },
        eexperienceposition: { type: 'string', minLength: 1, maxLength: 65 },
        eexperiencedescription: { type: 'string', maxLength: 1025 },
      }
    }
  }

  static get modifiers() {
    return {
      baseAttributes(builder) {
        builder.select('eexperienceid', 'eexperiencename', 'eexperiencestartdate', 'eexperienceenddate', 'eexperiencelocation',
        'eexperienceposition', 'eexperiencedescription')
        .withGraphFetched('industry(baseAttributes)')
      }
    }
  }

  static get relationMappings() {

    const Industry = require('./Industry')
    const File = require('./File')

    return {
      industry: {
        relation: Model.BelongsToOneRelation,
        modelClass: Industry,
        join: {
          from: 'eexperience.eindustryeindustryid',
          to: 'eindustry.eindustryid'
        }
      },
      files: {
        relation: Model.ManyToManyRelation,
        modelClass: File,
        join: {
          from: 'eexperience.eexperienceid',
          through: {
            from: 'efileexperiencemapping.eexperienceeexperienceid',
            to: 'efileexperiencemapping.efileefileid'
          },
          to: 'efile.efileid'
        }
      }
    }
  }

}

module.exports = Experience;