const Model = require('./Model');

class User extends Model {
  static get tableName() {
    return 'euser';
  };

  static get idColumn() {
    return 'euserid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['eusernik', 'eusername', 'euseremail', 'euserpassword', 'eusermobilenumber'],
      properties: {
        eusernik: {  type: 'string', minLength: 1, maxLength: 256 },
        eusername: { type: 'string', minLength: 1, maxLength: 256 },
        euseremail: { type: 'string', minLength: 1, maxLength: 256 },
        euserpassword: { type: 'string', minLength: 1, maxLength: 256 },
        eusermobilenumber: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }

  static get relationMappings() {

    const Permit = require('./Permit')
    const Company = require('./Company')

    return {
      permits: {
        relation: Model.HasManyRelation,
        modelClass: Permit,
        join: {
          from: 'euser.euserid',
          to: 'epermit.euseruserid'
        }
      },
      companies: {
        relation: Model.ManyToManyRelation,
        modelClass: Company,
        join: {
          from: 'euser.euserid',
          through: {
            from: 'ecompanyusermapping.eusereuserid',
            to: 'ecompanyusermapping.ecompanyecompanyid'
          },
          to: 'ecompany.ecompanyid'
        }
      }
    }
  }

  static get modifiers() {
    return {
      ...this.baseModifiers()
    }
  }
}

module.exports = User;