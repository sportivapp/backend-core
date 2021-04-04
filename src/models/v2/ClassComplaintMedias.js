const Model = require('./Model');

class ClassComplaintMedias extends Model {
    static get tableName() {
        return 'class_complaint_medias';
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
            list(builder) {
                builder.select('id', 'class_complaint_uuid')
                    .withGraphFetched('medias(baseAttributes)')
            },
        }
    }

    static get relationMappings() {

        const ClassComplaints = require('./ClassComplaints');
        const File = require('../File');
 
        return {
            classComplaint: {
                relation: Model.BelongsToOneRelation,
                modelClass: ClassComplaints,
                join: {
                    from: 'class_complaint_medias.class_complaint_uuid',
                    to: 'class_complaints.uuid',
                },
            },
            medias: {
                relation: Model.HasManyRelation,
                modelClass: File,
                join: {
                    from: 'class_complaint_medias.file_id',
                    to: 'efile.efileid',
                }
            }
        }
    }
}

module.exports = ClassComplaintMedias;