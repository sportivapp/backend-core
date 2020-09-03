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
    const Grade = require('./Grades')
    const Country = require('./Country')
    const File = require('./File')
    const Project =require('./Project')
    const Announcement = require('./Announcement');
    const Department = require('./Department')

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