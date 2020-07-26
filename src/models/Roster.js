const Model = require('./Model');

class Roster extends Model {
  static get tableName() {
    return 'eroster';
  };

  static get idColumn() {
    return 'erosterid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['erostername', 'eprojecteprojectid'],
      properties: {
        erostername: { type: 'string', minLength: 1, maxLength: 256 },
        erosterdescription: { type: 'string', minLength: 1, maxLength: 256 },
        eprojecteprojectid: {type: 'integer' },
        erostersupervisorid: {type: 'integer' },
        erosterheaduserid: {type: 'integer' }
      }
    };
  }
}

module.exports = Roster;