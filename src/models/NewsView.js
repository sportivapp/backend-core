const Model = require('./Model');

class NewsView extends Model {
    static get tableName() {
        return 'enewsview'
    };

    static get idColumn() {
        return 'enewsviewid'
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

module.exports = NewsView;