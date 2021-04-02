const Model = require('./Model');

class OrganizationBank extends Model {
    static get tableName() {
        return 'organization_bank';
    };

    static get idColumn() {
        return 'uuid'
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
            listByCompany(builder, companyId) {
                builder.select('uuid', 'account_name', 'account_number', 'status', 'is_main')
                    .modify('notDeleted')
                    .where('company_id', companyId)
                    .withGraphFetched('masterBank(baseAttributes)');
            },
            notDeleted(builder) {
                builder.where('delete_time', null);
            }
        }
    }

    static get relationMappings() {

        const Company = require('../Company');
        const MasterBank = require('./MasterBank');

        return {
            organization: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'organization_bank.company_id',
                    to: 'ecompany.ecompanyid',
                }
            },
            masterBank: {
                relation: Model.BelongsToOneRelation,
                modelClass: MasterBank,
                join: {
                    from: 'organization_bank.master_bank_id',
                    to: 'master_bank.id',
                }
            }
        }
    }
}

module.exports = OrganizationBank;