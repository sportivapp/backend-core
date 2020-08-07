const Company = require('../models/Company');
const Address = require('../models/Address');
const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const CompanyUserMapping = require('../models/CompanyUserMapping')
const ServiceHelper = require('../helper/ServiceHelper')

const CompanyService = {};

CompanyService.createCompany = async(userDTO, companyDTO, addressDTO) => {

    const address = await Address.query().insert(addressDTO);

    companyDTO.eaddresseaddressid = address.eaddressid;
    const company = await Company.query().insert(companyDTO);

    // super user of the company
    userDTO.euserpermission = 10;
    userDTO.ecompanyecompanyid = company.ecompanyid;
    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);
    const user = await User.query().insert(userDTO);

    return {
        user: user,
        company: company,
        address: address
    }

}

CompanyService.getUsersByCompanyId = async(companyId, page, size) => {

    const pageObj = await CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, pageObj)

}

CompanyService.saveUsersToCompany = async(companyId, users, loggedInUser) => {

    //accepting model [{'id': 1, 'deleted': false/true}]

    const company = await Company.query().findById(companyId)

    if(!company)
        return

    const deletedUserIds = users.filter(user => user.deleted)
        .map(user => user.id)

    const insertedUserIds = users.filter(user => !user.deleted)
        .map(user => user.id)

    const deleteRelations = CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', deletedUserIds)
        .deleteByUserId(loggedInUser.sub)

    const undoDeletedUsers = await CompanyUserMapping.query()
        .unDeleteByUserId(loggedInUser.sub)
        .where('ecompanyusermappingdeletestatus', true)
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', insertedUserIds)
        .returning('eusereuserid')

    return Promise.all([deleteRelations, undoDeletedUsers])
        .then(resultArr => {
            return resultArr[1]
        })
        .then(existedRelations => {
            return users
                .filter(user => !existedRelations.find(relation => relation.eusereuserid === user.id))
                .map(user => ({
                    eusereuserid: user.id,
                    ecompanyecompanyid: parseInt(companyId),
                    ecompanyusermappingcreateby: loggedInUser.sub
                }))
        })
        .then(freshRelations => {
            return CompanyUserMapping.query().insert(freshRelations)
        })

}

module.exports = CompanyService;