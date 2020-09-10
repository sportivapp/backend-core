const Model = require('./Model');

class File extends Model {
  static get tableName() {
    return 'efile';
  };

  static get idColumn() {
    return 'efileid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['efilename', 'efilepath', 'efiletype'],
      properties: {
        efilename: { type: 'string', minLength: 1, maxLength: 256 },
        efilepath: { type: 'string', minLength: 1, maxLength: 256 },
        efiletype: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }

  static get modifiers() {
    return {
      baseAttributes(builder) {
        builder.select('efileid', 'efilename', 'efilepath', 'efiletype')
      }
    }
  }

}

module.exports = File;