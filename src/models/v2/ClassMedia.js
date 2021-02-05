const Model = require('./Model');

class ClassMedia extends Model {
    static get tableName() {
        return 'class_media';
    };

    static get idColumn() {
        return 'id'
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
                builder.select('id', 'file_id', 'class_uuid');
            }
        }
    }

    static get relationMappings() {

        const Class = require('./Class');
        const File = require('../File');
 
        return {
            class: {
                relation: Model.BelongsToOneRelation,
                modelClass: Class,
                join: {
                    from: 'class_media.class_uuid',
                    to: 'class.uuid',
                },
            },
            file: {
                relation: Model.BelongsToOneRelation,
                modelClass: File,
                join: {
                    from: 'class_media.file_id',
                    to: 'efile.efileid',
                },
            },
        }
    }
}

module.exports = ClassMedia;