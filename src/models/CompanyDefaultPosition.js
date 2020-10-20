const Model = require('./Model');

class CompanyDefaultPosition extends Model {
  static get tableName() {
    return 'ecompanydefaultposition';
  };

  static get idColumn() {
    return 'ecompanydefaultpositionid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ecompanyecompanyid', 'eadmingradeid', 'emembergradeid'],
      properties: {
        ecompanyecompanyid: { type: 'integer' },
        eadmingradeid: { type: 'integer' },
        emembergradeid: { type: 'integer' }
      }
    }
  }

  static get relationMappings() {
    return {}
  }
  
}

module.exports = CompanyDefaultPosition;