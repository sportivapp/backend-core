const Model = require('./Model');

class ThreadPost extends Model {
  static get tableName() {
    return 'ethreadpost';
  };

  static get idColumn() {
    return 'ethreadpostid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ethreadpostcomment'],
      properties: {
        ethreadpostcomment: { type: 'string', minLength: 1, maxLength: 501 }
      }
    }
  }
}

module.exports = ThreadPost;