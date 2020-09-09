const Model = require('./Model');
const Team = require('./Team');
const Industry = require('./Industry');
const License = require('./License');
const Experience = require('./Experience');

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
      required: ['eusername', 'euseremail', 'euserpassword', 'eusermobilenumber'], // 'eusernik', 
      properties: {
        // eusernik: {  type: 'string', minLength: 1, maxLength: 256 },
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
    const Grade = require('./Grades')
    const Country = require('./Country')
    const File = require('./File')
    const Project =require('./Project')
    const Announcement = require('./Announcement');
    const Department = require('./Department')
    const UserIndustryMapping = require('./UserIndustryMapping')

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
      },
      grades: {
        relation: Model.ManyToManyRelation,
        modelClass: Grade,
        join: {
          from: 'euser.euserid',
          through: {
            from: 'euserpositionmapping.eusereuserid',
            to: 'euserpositionmapping.egradeegradeid'
          },
          to: 'egrade.egradeid'
        }
      },
      departments: {
        relation: Model.ManyToManyRelation,
        modelClass: Department,
        join: {
          from: 'euser.euserid',
          through: {
            from: 'euserpositionmapping.eusereuserid',
            to: 'euserpositionmapping.edepartmentedepartmentid'
          },
          to: 'edepartment.edepartmentid'
        }
      },
      country: {
        relation: Model.BelongsToOneRelation,
        modelClass: Country,
        join: {
          from: 'euser.ecountryecountryid',
          to: 'ecountry.ecountryid'
        }
      },
      file: {
        relation: Model.BelongsToOneRelation,
        modelClass: File,
        join: {
          from: 'euser.efileefileid',
          to: 'efile.efileid'
        }
      },
      approvalUser1: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'euser.euserapprovaluserid1',
          to: 'euser.euserid'
        }
      },
      approvalUser2: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'euser.euserapprovaluserid2',
          to: 'euser.euserid'
        }
      },
      approvalUser3: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'euser.euserapprovaluserid3',
          to: 'euser.euserid'
        }
      },
      projects: {
        relation: Model.HasManyRelation,
        modelClass: Project,
        join: {
          from: 'euser.euserid',
          to: 'eproject.eprojectsupervisorid'
        }
      },
      announcements: {
        relation: Model.ManyToManyRelation,
        modelClass: Announcement,
        join: {
            from: 'euser.euserid',
            through: {
              from: 'eannouncementusermapping.eusereuserid',
              to: 'eannouncementusermapping.eannouncementeannouncementid'
            },
            to: 'eannouncement.eannouncementid'
        }
      },
      applications: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'euser.euserid',
          through: {
            from: 'eapplyinvite.eusereuserid',
            to: 'eapplyinvite.ecompanyecompanyid'
          },
          to: 'ecompany.ecompanyid'
        }
      },
      teams: {
        relation: Model.ManyToManyRelation,
        modelClass: Team,
        join: {
            from: 'euser.euserid',
            through: {
                from: 'eteamusermapping.eusereuserid',
                to: 'eteamusermapping.eteameteamid'
            },
            to: 'eteam.eteamid'
        }
      },
      // userIndustries: {
      //   relation: Model.ManyToManyRelation,
      //   modelClass: Industry,
      //   join: {
      //     from: 'euser.euserid',
      //     through: {
      //       from: 'euserindustrymapping.eusereuserid',
      //       to: 'euserindustrymapping.eindustryeindustryid'
      //     },
      //     to: 'eindustry.eindustryid'
      //   }
      // }
      userIndustriesMapping: {
        relation: Model.HasManyRelation,
        modelClass: UserIndustryMapping,
        join: {
          from: 'euser.euserid',
          to: 'euserindustrymapping.eusereuserid'
        }
      },
      userIndustries: {
        relation: Model.ManyToManyRelation,
        modelClass: Industry,
        join: {
          from: 'euser.euserid',
          through: {
            from: 'euserindustrymapping.eusereuserid',
            to: 'euserindustrymapping.eindustryeindustryid'
          },
          to: 'eindustry.eindustryid'
        }
      },
      coachIndustriesMapping: {
        relation: Model.HasManyRelation,
        modelClass: UserIndustryMapping,
        join: {
          from: 'euser.euserid',
          to: 'ecoachindustrymapping.eusereuserid'
        }
      },
      coachIndustries: {
        relation: Model.ManyToManyRelation,
        modelClass: Industry,
        join: {
          from: 'euser.euserid',
          through: {
            from: 'ecoachindustrymapping.eusereuserid',
            to: 'ecoachindustrymapping.eindustryeindustryid'
          },
          to: 'eindustry.eindustryid'
        }
      },
      licenses: {
        relation: Model.HasManyRelation,
        modelClass: License,
        join: {
          from: 'euser.euserid',
          to: 'elicense.elicensecreateby'
        }
      },
      experiences: {
        relation: Model.HasManyRelation,
        modelClass: Experience,
        join: {
          from: 'euser.euserid',
          to: 'eexperience.eusereuserid'
        }
      }
    }
  }

  static get modifiers() {
    return {
      ...this.baseModifiers(),
      baseAttributes(builder) {
        builder.select('euserid', 'eusername', 'euseremail', 'eusernik', 'eusermobilenumber')
      }
    }
  }
}

module.exports = User;