const Model = require('./Model');

class City extends Model {
  static get tableName() {
    return 'ecity';
  };

  static get idColumn() {
    return 'ecityid'
  };

  static get modifiers() {
    return {
        baseAttributes(builder) {
            builder.select('ecityid', 'ecityname')
        },
        timezone(builder) {
          builder.select('ecityid', 'ecityname')
            .withGraphFetched('state(timezone)')
        }
    }
}

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ecityname'],
      properties: {
        ecityname: { type: 'string', minLength: 1, maxLength: 256 }
      }
    };
  }

  static get relationMappings() {

    const State = require('./State')

    return {
      state: {
        relation: Model.BelongsToOneRelation,
        modelClass: State,
        join: {
          from: 'ecity.estateestateid',
          to: 'estate.estateid'
        }
      }
    }
  }

}

module.exports = City;