const Model = require('./Model');

class ReportThreadType extends Model {
    static get tableName() {
        return 'ereportthreadtype';
    };

    static get idColumn() {
        return 'ereportthreadtypeid'
    };

    static get jsonSchema() {}

    static get modifiers() {
        return {
            baseAttributes(builder) {
                builder.select('ereportthreadtypeid', 'ereportthreadtypename')
            }
        }
    }

    static get relationMappings() {

        const ReportThread = require('./ReportThread')

        return {
            reportThread: {
                relation: Model.HasManyRelation,
                modelClass: ReportThread,
                join: {
                    from: 'ereportthreadtype.ereportthreadtypeid',
                    to: 'ereportthread.ereportthreadtypeereportthreadtypeid'
                }
            }
        }

    }
}

module.exports = ReportThreadType;