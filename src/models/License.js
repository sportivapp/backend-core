const Model = require('./Model');

class License extends Model {
  static get tableName() {
    return 'elicense';
  };

  static get idColumn() {
    return 'elicenseid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['elicenseacademicname', 'elicensegraduationdate', 'eindustryeindustryid', 'elicenselevel', 'efileefileid'],
      properties: {
        elicenseacademicname: { type: 'string', minLength: 1, maxLength: 256 },
        eindustryeindustryid: { type: 'integer' },
        elicenselevel: { type: 'string', minLength: 1, maxLength: 256 },
        efileefileid: { type: 'integer' },
        elicenseadditionalinformation: { type: 'string', minLength: 0, maxLength: 256 }
      }
    };
  }

  static get modifiers() {
    return {
      baseAttributes(builder) {
        builder.select('elicenseid', 'elicenseacademicname', 'elicensegraduationdate', 'elicenselevel', 'elicenseadditionalinformation')
        .withGraphFetched('industry(baseAttributes)')
        .withGraphFetched('file(baseAttributes)')
      }
    }
  }

  static get relationMappings() {

    const File = require('./File');
    const Industry = require('./Industry');

    return {
      industry: {
        relation: Model.BelongsToOneRelation,
        modelClass: Industry,
        join: {
          from: 'elicense.eindustryeindustryid',
          to: 'eindustry.eindustryid'
        }
      },
      file: {
        relation: Model.BelongsToOneRelation,
        modelClass: File,
        join: {
          from: 'elicense.efileefileid',
          to: 'efile.efileid'
        }
      }
    }
  }

}

module.exports = License;