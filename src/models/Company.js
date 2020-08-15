const Model = require('./Model');

class Company extends Model {
  static get tableName() {
    return 'ecompany';
  };

  static get idColumn() {
    return 'ecompanyid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        
      }
    };
  }

  static get relationMappings() {

    const User = require('./User')

    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'ecompany.ecompanyid',
          through: {
            from: 'ecompanyusermapping.ecompanyecompanyid',
            to: 'ecompanyusermapping.eusereuserid'
          },
          to: 'euser.euserid'
        }
      },
      branches: {
        relation: Model.HasManyRelation,
        modelClass: Company,
        join: {
          from: 'ecompany.ecompanyid',
          to: 'ecompany.ecompanyparentid'
        }
      },
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Company,
        join: {
          from: 'ecompany.ecompanyparentid',
          to: 'ecompany.ecompanyid'
        }
      },
      sisters: {
        relation: Model.HasManyRelation,
        modelClass: Company,
        join: {
          from: 'ecompany.ecompanyid',
          to: 'ecompany.ecompanyolderid'
        }
      },
      older: {
        relation: Model.BelongsToOneRelation,
        modelClass: Company,
        join: {
          from: 'ecompany.ecompanyolderid',
          to: 'ecompany.ecompanyid'
        }
      }
    }
  }
}

module.exports = Company;