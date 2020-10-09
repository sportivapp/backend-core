const Model = require('./Model');
const Company = require('./Company');
const TeamUserMapping = require('./TeamUserMapping');
const Industry = require('./Industry');

class Team extends Model {
    static get tableName() {
        return 'eteam';
    };

    static get idColumn() {
        return 'eteamid';
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
            builder.select('eteamid', 'eteamname', 'eteamdescription', 'eteamispublic').withGraphFetched('teamPicture(baseAttributes)')
          }
        }
      }

    static get relationMappings() {

        const File = require('./File')
        const User = require('./User')

        return {
            position: {
                relation: Model.HasManyRelation,
                modelClass: TeamUserMapping,
                join: {
                    from: 'eteam.eteamid',
                    to: 'eteamusermapping.eteameteamid'
                }
            },
            members: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'eteam.eteamid',
                    through: {
                        from: 'eteamusermapping.eteameteamid',
                        to: 'eteamusermapping.eusereuserid'
                    },
                    to: 'euser.euserid'
                }
            },
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'eteam.ecompanyecompanyid',
                    to: 'ecompany.ecompanyid'
                }
            },
            // industries: {
            //     relation: Model.ManyToManyRelation,
            //     modelClass: Industry,
            //     join: {
            //         from: 'eteam.eteamid',
            //         through: {
            //             from: 'eteamindustrymapping.eteameteamid',
            //             to: 'eteamindustrymapping.eindustryeindustryid'
            //         },
            //         to: 'eindustry.eindustryid'
            //     }
            // },
            teamIndustry: {
                relation: Model.BelongsToOneRelation,
                modelClass: Industry,
                join: {
                    from: 'eteam.eindustryeindustryid',
                    to: 'eindustry.eindustryid'
                }
            },
            teamPicture: {
                relation: Model.BelongsToOneRelation,
                modelClass: File,
                join: {
                    from: 'eteam.efileefileid',
                    to: 'efile.efileid'
                }
            }
        }
    }
}

module.exports = Team;