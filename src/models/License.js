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
      required: ['elicenseacademicname', 'elicensegraduationdate', 'esporttypeesporttypeid', 'elicenselevel', 'efileefileid'],
      properties: {
        elicenseacademicname: { type: 'string', minLength: 1, maxLength: 256 },
        esporttypeesporttypeid: { type: 'integer' },
        elicenselevel: { type: 'string', minLength: 1, maxLength: 256 },
        efileefileid: { type: 'integer' },
        elicenseadditionalinformation: { type: 'string', minLength: 0, maxLength: 256 }
      }
    };
  }

  static get relationMappings() {

    const File = require('./File');
    const SportType = require('./SportType');

    return {
      sporttype: {
        relation: Model.BelongsToOneRelation,
        modelClass: SportType,
        join: {
          from: 'elicense.esporttypeesporttypeid',
          to: 'esporttype.esporttypeid'
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