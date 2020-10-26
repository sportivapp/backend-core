const Model = require('./Model');

class Address extends Model {
  static get tableName() {
    return 'eaddress';
  };

  static get idColumn() {
    return 'eaddressid'
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
              builder.select('eaddressid', 'eaddressstreet', 'eaddresslongitude', 'eaddresslatitude')
                .withGraphFetched('state(baseAttributes)')
                .withGraphFetched('country(baseAttributes)')
          }
      }
  }

    static get relationMappings() {

      const Country = require('./Country')
      const State = require('./State')

      return {
        country: {
          relation: Model.BelongsToOneRelation,
          modelClass: Country,
          join: {
              from: 'eaddress.ecountryecountryid',
              to: 'ecountry.ecountryid'
          }
        },
        state: {
          relation: Model.BelongsToOneRelation,
          modelClass: State,
          join: {
            from: 'eaddress.estateestateid',
            to: 'estate.estateid'
          }
        }
    }
  }
}

module.exports = Address;