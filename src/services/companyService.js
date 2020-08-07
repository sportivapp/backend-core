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

    console.log(insertedUserIds)

    const deleteRelations = CompanyUserMapping.query()
        .deleteByUserId(loggedInUser.sub)
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', deletedUserIds)

    const undoDeletedUsers = await CompanyUserMapping.query()
        .unDeleteByUserId(loggedInUser.sub)
        .where('ecompanyusermappingdeletestatus', true)
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', insertedUserIds)
        .returning('eusereuserid')

    return Promise.all([deleteRelations, undoDeletedUsers])
        .then(resultArr => resultArr[1])
        .then(existedRelations => {
            const freshRelations = insertedUserIds
                .filter(userId => !existedRelations.find(relation => relation.eusereuserid === userId))
                .map(userId => ({
                    eusereuserid: userId,
                    ecompanyecompanyid: parseInt(companyId),
                    ecompanyusermappingcreateby: loggedInUser.sub
                }))
            return [freshRelations, existedRelations]
        })
        .then(relationArr => {
            return CompanyUserMapping.query().insert(relationArr[0])
                .then(freshRelations => {
                    let resultArr = []
                    resultArr.push(...relationArr[1])
                    resultArr.push(...freshRelations)
                    return resultArr
                })
        })

}

module.exports = CompanyService;