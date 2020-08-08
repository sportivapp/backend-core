const Model = require('./Model');
const Project = require('./Project');

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

  static get relationMappings() {
    return {
      project: {
        relation: Model.BelongsToOneRelation,
        modelClass: Project,
        join: {
          from: 'eroster.eprojecteprojectid',
          to: 'eproject.eprojectid'
        }
      }
    }
  }
}

module.exports = Roster;