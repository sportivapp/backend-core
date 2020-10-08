const Model = require('./Model');

class Thread extends Model {
  static get tableName() {
    return 'ethread';
  };

  static get idColumn() {
    return 'ethreadid'
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ethreadtitle', 'ethreadtype', 'ethreadispublic'],
      properties: {
        ethreadtitle: { type: 'string', minLength: 1, maxLength: 256 },
        ethreadtype: { type: 'string', minLength: 1, maxLength: 64 },
        ethreadispublic: { type: 'boolean' },
      }
    }
  }

  static get modifiers() {
    return {
      baseAttributes(builder) {
        builder.select('ethreadid', 'ethreadtitle', 'ethreaddescription', 'ethreadtype', 'ethreadispublic', 'ecompanyecompanyid', 'eteameteamid')
      }
    }
  }

  static get relationMappings() {
  
    const ThreadPost = require('./ThreadPost')
    const Company = require('./Company')
    const Team = require('./Team')

    return {
      comments: {
        relation: Model.HasManyRelation,
        modelClass: ThreadPost,
        join: {
          from: 'ethread.ethreadid',
          to: 'ethreadpost.ethreadethreadid'
        }
      },
      company: {
        relation: Model.BelongsToOneRelation,
        modelClass: Company,
        join: {
          from: 'ethread.ecompanyecompanyid',
          to: 'ecompany.ecompanyid'
        }
      },
      team: {
        relation: Model.BelongsToOneRelation,
        modelClass: Team,
        join: {
          from: 'ethread.eteameteamid',
          to: 'eteam.eteamid'
        }
      }
    }

  }
}

module.exports = Thread;