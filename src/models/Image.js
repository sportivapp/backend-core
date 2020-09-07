const Model = require('./Model');

class Image extends Model {
  static get tableName() {
    return 'eimage';
  };

  static get idColumn() {
    return 'eimageid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['eimagefile'],
      properties: {
        eimagefile: { type: 'binary' },
        eimagetype: { type: 'integer' },
        eimagecreateby: { type: 'integer' },
      }
    };
  }
}

module.exports = Image;