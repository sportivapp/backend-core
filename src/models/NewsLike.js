const Model = require('./Model');

class NewsLike extends Model {
    static get tableName() {
        return 'enewslike'
    };

    static get idColumn() {
        return 'enewslikeid'
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {

            }
        };
    }

    static get relationMappings() {}

}

module.exports = NewsLike;