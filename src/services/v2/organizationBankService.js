const { UnsupportedOperationError } = require('../../models/errors');
const OrganizationBank = require('../../models/v2/OrganizationBank');

const ErrorEnum = {
    MAIN_BANK: 'MAIN_BANK',
}

const organizationBankService = {};

organizationBankService.getAllCompanyBanks = async (companyId) => {

    return OrganizationBank.query()
        .modify('listByCompany', companyId)

}

organizationBankService.createCompanyBank = async (companyBankDTO, user) => {

    const companyBanks = await organizationBankService.getAllCompanyBanks(companyBankDTO.companyId);

    if (companyBanks.length === 0)
        companyBankDTO.isMain = true;

    return OrganizationBank.query()
        .insertToTable(companyBankDTO, user.sub);

}

organizationBankService.softDeleteCompanyBank = async (companyId, companyBankUuid) => {

    const organizationBank = await OrganizationBank.query()
        .findById(companyBankUuid)
        .where('company_id', companyId);

    if (organizationBank.isMain)
        throw new UnsupportedOperationError(ErrorEnum.MAIN_BANK);

    return organizationBank.$query()
        .softDelete()
        .then(rowsAffected => rowsAffected === 1);

}

organizationBankService.findCompanyMainBank = async (companyId) => {

    return OrganizationBank.query()
        .modify('notDeleted')
        .where('company_id', companyId)
        .where('is_main', true)
        .first();

}

organizationBankService.updateCompanyBankToMain = async (companyId, companyBankUuid, user) => {

    const mainCompanyBank = await organizationBankService.findCompanyMainBank(companyId);

    return OrganizationBank.transaction(async trx => {

        await mainCompanyBank.$query(trx)
            .updateByUserId({
                isMain: false,
            }, user.sub)
            .returning('*');

        return OrganizationBank.query(trx)
            .findById(companyBankUuid)
            .updateByUserId({
                isMain: true,
            }, user.sub)
            .returning('*');

    });

}

module.exports = organizationBankService;