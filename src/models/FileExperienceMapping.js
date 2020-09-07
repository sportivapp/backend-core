const Model = require('./Model');

class FileExperienceMapping extends Model {
  static get tableName() {
    return 'efileexperiencemapping';
  };

  static get idColumn() {
    return 'efileexperiencemappingid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['efileefileid'],
      properties: {
        efileefileid: { type: 'integer' },
        eexperienceeexperienceid: { type: 'integer' }
      }
    };
  }

}

module.exports = FileExperienceMapping;