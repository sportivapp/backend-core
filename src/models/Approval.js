const Model = require('./Model');

class Approval extends Model {
    static get tableName() {
        return 'eapproval';
    };

    static get idColumn() {
        return 'eapprovalid';
    };

    static get jsonSchema() {
        return {
            type: 'object',
            required: [],
            properties: {
                edepartedepartmentid: { type: 'integer' },
                ecompanyecompanyid: { type: 'integer' }
            }
        };
    }

    static get relationMappings() {

        const User = require('./User');
        const Department = require('./Department');
        const Company = require('./Company');
        const ApprovalUser = require('./ApprovalUser')

        return {
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'eapproval.ecompanyecompanyid',
                    to: 'ecompany.ecompanyid'
                }
            },
            target: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'eapproval.etargetuserid',
                    to: 'euser.euserid'
                }
            },
            department: {
                relation: Model.BelongsToOneRelation,
                modelClass: Department,
                join: {
                    from: 'eapproval.edepartmentedepartmentid',
                    to: 'edepartment.edepartmentid'
                }
            },
            approvalUsers: {
                relation: Model.HasManyRelation,
                modelClass: ApprovalUser,
                join: {
                    from: 'eapproval.eapprovalid',
                    to: 'eapprovaluser.eapprovaleapprovalid'
                }
            },
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'eapproval.eapprovalid',
                    through: {
                        from: 'eapprovaluser.eapprovaleapprovalid',
                        to: 'eapprovaluser.eusereuserid'
                    },
                    to: 'euser.euserid'
                }
            }
        }
    }

}

module.exports = Approval;