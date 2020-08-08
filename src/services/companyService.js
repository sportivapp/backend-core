const Company = require('../models/Company');
const Address = require('../models/Address');
const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const CompanyUserMapping = require('../models/CompanyUserMapping')
const { raw } = require('objection')
const ServiceHelper = require('../helper/ServiceHelper')

const CompanyService = {};

CompanyService.registerCompany = async(userDTO, companyDTO, addressDTO) => {

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
        .patch({
            edeletestatus: true,
            eassigndeleteby: loggedInUser.sub,
            eassigndeletetime: Date.now()
        })
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', deletedUserIds)

    const undoDeletedUsers = CompanyUserMapping.query()
        .patch({ edeletestatus: false })
        .where('edeletestatus', true)
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
                    eassigncreateby: loggedInUser.sub
                }))
        })
        .then(freshRelations => {
            return CompanyUserMapping.query().insert(freshRelations)
        })

}

CompanyService.createCompany = async(userId, companyDTO, addressDTO, user) => {

    const address = await Address.query().insert(addressDTO);

    companyDTO.eaddresseaddressid = address.eaddressid;
    const company = await Company.query().insert(companyDTO);

    const id = ( isNaN(userId) ) ? parseInt(user.sub) : userId

    const companyUserMapping = await CompanyUserMapping.query().insert({
        ecompanyecompanyid: company.ecompanyid,
        eusereuserid: id,
        eassigncreateby: user.sub
    })


    // super user of the company
    const updateUser = await User.query()
    .patchAndFetchById( id , isNaN(userId) ?
        {
            euserpermission: 10
        }
        :
        {
            euserpermission: 10,
            ecompanyecompanyid: company.ecompanyid
        }
    );

    return {
        user: updateUser,
        company: company,
        address: address,
        companyusermapping: companyUserMapping
    }

}

CompanyService.getCompany = async (page, size, type, keyword) => {
    const newKeyword = keyword.toLowerCase()
    let query = Company.query()
            .select()
            .where(raw('lower("ecompanyname")'), 'like', `%${newKeyword}%`)
            .andWhere('ecompanydeletestatus', false)
    if ( type === 'company')
        query.whereNull('ecompanyparentid')

    else
        query.whereNotNull('ecompanyparentid')

    const pageObj = await query.page(page, size)

    return ServiceHelper.toPageObj(page, size, pageObj)

}

CompanyService.editCompany = async (companyId, companyDTO) => {

    return Company.query().patchAndFetchById(companyId, companyDTO)
}

CompanyService.deleteCompany = async (companyId, companyDTO) => {

    return Company.query().patchAndFetchById(companyId, companyDTO)

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
        .patch({
            edeletestatus: true,
            eassigndeleteby: loggedInUser.sub,
            eassigndeletetime: Date.now()
        })
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', deletedUserIds)

    const undoDeletedUsers = CompanyUserMapping.query()
        .patch({ edeletestatus: false })
        .where('edeletestatus', true)
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', insertedUserIds)
        .returning('eusereuserid')

    return Promise.all([deleteRelations, undoDeletedUsers])
        .then(resultArr => {
            console.log('passed')
            return resultArr[1]
        })
        .then(existedRelations => {
            console.log('passed')
            return users
                .filter(user => !existedRelations.find(relation => relation.eusereuserid === user.id))
                .map(user => ({
                    eusereuserid: user.id,
                    ecompanyecompanyid: parseInt(companyId),
                    eassigncreateby: loggedInUser.sub
                }))
        })
        .then(freshRelations => {
            return CompanyUserMapping.query().insert(freshRelations)
        })

}

module.exports = CompanyService;