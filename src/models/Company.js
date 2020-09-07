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

  static get modifiers() {
    return {
      baseAttributes(builder) {
        builder.select('ecompanyid', 'ecompanyname', 'ecompanylogo')
      }
    }
  }

  static get relationMappings() {

    const User = require('./User')
    const Department = require('./Department')
    const Address = require('./Address')
    const Industry = require('./Industry')
    const File = require('./File')

    return {
      address: {
        relation: Model.BelongsToOneRelation,
        modelClass: Address,
        join: {
            from: 'ecompany.eaddresseaddressid',
            to: 'eaddress.eaddressid'
        }
      },
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
      },
      departments: {
        relation: Model.HasManyRelation,
        modelClass: Department,
        join: {
          from: 'ecompany.ecompanyid',
          to: 'edepartment.ecompanyecompanyid'
        }
      },
      industry: {
        relation: Model.BelongsToOneRelation,
        modelClass: Industry,
        join: {
          from: 'ecompany.eindustryeindustryid',
          to: 'eindustry.eindustryid'
        }
      },
      file: {
        relation: Model.BelongsToOneRelation,
        modelClass: File,
        join: {
          from: 'ecompany.efileefileid',
          to: 'efile.efileid'
        }
      },
      invites: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'ecompany.ecompanyid',
          through: {
            from: 'eapplyinvite.ecompanyecompanyid',
            to: 'eapplyinvite.eusereuserid'
          },
          to: 'euser.euserid'
        }
      }
    }
  }
}

module.exports = Company;