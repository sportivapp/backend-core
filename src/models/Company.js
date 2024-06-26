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
        builder.select('ecompanyid', 'ecompanyname').withGraphFetched('logo(baseAttributes)')
      },
      idAndName(builder) {
        builder.select('ecompanyid as companyId', 'ecompanyname as companyName')
      },
      about(builder) {
        builder.select('ecompanyid', 'ecompanyname', 'ecompanyphonenumber', 'ecompanyemailaddress', 'ecompanyabout')
          .withGraphFetched('logo(baseAttributes)')
          .withGraphFetched('carousel(baseAttributes)')
          .withGraphFetched('address(baseAttributes)')
          .withGraphFetched('industries(baseAttributes)')
      }
    }
  }

  static get relationMappings() {

    const User = require('./User')
    const Department = require('./Department')
    const Address = require('./Address')
    const Industry = require('./Industry')
    const File = require('./File')
    const News = require('./News')

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
      industries: {
        relation: Model.ManyToManyRelation,
        modelClass: Industry,
        join: {
          from: 'ecompany.ecompanyid',
          through: {
            from: 'ecompanyindustrymapping.ecompanyecompanyid',
            to: 'ecompanyindustrymapping.eindustryeindustryid'
          },
          to: 'eindustry.eindustryid'
        }
      },
      logo: {
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
      },
      news: {
        relation: Model.HasManyRelation,
        modelClass: News,
        join: {
          from: 'ecompany.ecompanyid',
          to: 'enews.ecompanyecompanyid'
        }
      },
      carousel: {
        relation: Model.ManyToManyRelation,
        modelClass: File,
        join: {
          from: 'ecompany.ecompanyid',
          through: {
            from: 'ecompanycarouselmapping.ecompanyecompanyid',
            to: 'ecompanycarouselmapping.efileefileid'
          },
          to: 'efile.efileid'
        }
      },
      theories: {
        relation: Model.ManyToManyRelation,
        modelClass: File,
        join: {
          from: 'ecompany.ecompanyid',
          through: {
            from: 'ecompanyfilemapping.ecompanyecompanyid',
            to: 'ecompanyfilemapping.efileefileid'
          },
          to: 'efile.efileid'
        }
      }
    }
  }
}

module.exports = Company;