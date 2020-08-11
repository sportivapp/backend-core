const Company = require('../models/Company');
const Address = require('../models/Address');
const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyModuleMapping = require('../models/CompanyModuleMapping')
const Module = require('../models/Module')
const { raw } = require('objection')
const ServiceHelper = require('../helper/ServiceHelper')

const CompanyService = {};

CompanyService.registerCompany = async(userDTO, companyDTO, addressDTO) => {

    const address = await Address.query().insert(addressDTO);

    companyDTO.eaddresseaddressid = address.eaddressid;
    companyDTO.ecompanycreateby = 0;
    const company = await Company.query().insert(companyDTO);

    // super user of the company
    userDTO.ecompanyecompanyid = company.ecompanyid;
    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);
    const user = await User.query().insert(userDTO);

    const companyUserDTO = {
        eusereuserid: user.euserid,
        ecompanyecompanyid: company.ecompanyid,
        ecompanyusermappingpermission: 10,
        ecompanyusermappingcreateby: 0
    }

    const insertCompanyModuleMappingQuery = Module.query()
        .then(modules => {
            return modules.map(module => ({
                ecompanymodulemappingname: module.emodulename,
                ecompanyecompanyid: company.ecompanyid,
                emoduleemoduleid: module.emoduleid
            }))
        })
        .then(modules => CompanyModuleMapping.query().insert(modules))


    const insertCompanyUserMappingQuery = CompanyUserMapping.query().insert(companyUserDTO)

    return Promise.all([insertCompanyModuleMappingQuery, insertCompanyUserMappingQuery])
        .then(ignored => ({
            user: user,
            company: company,
            address: address
        }))

}

CompanyService.getUsersByCompanyId = async(companyId, page, size, deleteStatus) => {

    let query = CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)

    if (deleteStatus) query = query.modify('deleted')
    else query = query.modify('notDeleted')

    const relationPage = await query.page(page, size)

    const total = relationPage.total
    const userIds = relationPage.results
        .map(relation => relation.eusereuserid)

    return User.query().whereIn('euserid', userIds)
        .then(users => ({
            results: users,
            total: total
        }))
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

CompanyService.getAllCompanyByUserId = async(userId) => {

    const result = await User.relatedQuery('companies')
    .for(userId)
    .modify({ ecompanyusermappingdeletestatus: false })
    .where('ecompanyparentid', null)
    .orderBy('ecompanyusermappingcreatetime', 'ASC')

    return result

}

CompanyService.saveUsersToCompany = async(companyId, users, loggedInUser) => {

    //accepting model [{'id': 1, 'deleted': false/true, 'permission': 10}]

    const company = await Company.query().findById(companyId)

    if(!company)
        return

    let deleteRelationPromises = []

    let unDeleteRelationPromises = []

    const deletedUsers = users.filter(user => user.deleted)

    const insertedUsers = users.filter(user => !user.deleted)

    const filterRelationsByIdAndPermission = (relation, user) => {
        return user.id === relation.eusereuserid && user.permission === relation.ecompanyusermappingpermission
    }

    const deleteRelation = (userId, permission) => CompanyUserMapping.query()
        .where('eusereuserid', userId)
        .where('ecompanyusermappingpermission', permission)
        .deleteByUserId(loggedInUser.sub)

    const unDeleteRelation = (userId, permission) => CompanyUserMapping.query()
        .where('eusereuserid', userId)
        .where('ecompanyusermappingpermission', permission)
        .unDeleteByUserId(loggedInUser.sub)

    const selectRelationsByDeleteStatusQuery = (status) => CompanyUserMapping.query()
        .where('ecompanyusermappingdeletestatus', status)
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', insertedUsers.map(user => user.id))

    const selectDeleteRelations = CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .whereIn('eusereuserid', deletedUsers.map(user => user.id))
        .then(relations => {
            relations
                .filter(relation => !!deletedUsers.find(user => filterRelationsByIdAndPermission(relation, user)))
                .forEach(relation => deleteRelationPromises.push(deleteRelation(relation.eusereuserid, relation.ecompanyusermappingpermission)))
            return deleteRelationPromises
        })

    const selectUnDeletedRelations = selectRelationsByDeleteStatusQuery(true)
        .then(relations => {
            relations
                .filter(relation => !!insertedUsers.find(user => filterRelationsByIdAndPermission(relation, user)))
                .forEach(relation => unDeleteRelationPromises.push(unDeleteRelation(relation.eusereuserid, relation.ecompanyusermappingpermission)))
            return unDeleteRelationPromises
        })

    const filterNewUserIds = (existedRelations) => {
        return insertedUsers
            .filter(user => !existedRelations.find(relation => filterRelationsByIdAndPermission(relation, user)))
            .map(user => ({
                eusereuserid: user.id,
                ecompanyecompanyid: parseInt(companyId),
                ecompanyusermappingcreateby: loggedInUser.sub,
                ecompanyusermappingpermission: user.permission
            }))
    }

    const getAllUsersDataByCompany = Company.relatedQuery('users')
        .for(companyId)
        .modify({ ecompanyusermappingdeletestatus: false })

    return Promise.all([selectDeleteRelations, selectUnDeletedRelations])
        .then(arrayOfPromises => Promise.all([...arrayOfPromises[0], ...arrayOfPromises[1]]))
        .then(ignored => selectRelationsByDeleteStatusQuery(false))
        .then(existedIds => filterNewUserIds(existedIds))
        .then(freshRelations => CompanyUserMapping.query().insert(freshRelations))
        .then(ignored => getAllUsersDataByCompany)

}

CompanyService.createCompany = async(userId, companyDTO, addressDTO, user) => {

    const address = await Address.query().insert(addressDTO);

    companyDTO.eaddresseaddressid = address.eaddressid;
    companyDTO.ecompanycreateby = user.sub;
    const company = await Company.query().insert(companyDTO);

    const id = ( isNaN(userId) ) ? parseInt(user.sub) : userId

    const companyUserMappingDTO = {
        ecompanyecompanyid: company.ecompanyid,
        eusereuserid: id,
        ecompanyusermappingcreateby: user.sub,
        ecompanyusermappingpermission: 10
    }

    const patchDTO = isNaN(userId) ? { euserpermission: 10 } :
        {
            euserpermission: 10,
            ecompanyecompanyid: company.ecompanyid
        }

    const insertCompanyModuleMappingQuery = Module.query()
        .then(modules => {
            return modules.map(module => ({
                ecompanymodulemappingname: module.emodulename,
                ecompanyecompanyid: company.ecompanyid,
                emoduleemoduleid: module.emoduleid
            }))
        })
        .then(modules => CompanyModuleMapping.query().insert(modules))

    const insertCompanyUserMappingQuery = CompanyUserMapping.query().insert(companyUserMappingDTO)

    // super user of the company
    const updateUserQuery = User.query()
        .findById(id)
        .updateByUserId(patchDTO, user.sub)
        .returning('*');

    return Promise.all([insertCompanyModuleMappingQuery, insertCompanyUserMappingQuery, updateUserQuery])
        .then(resultArr => ({
            company: company,
            address: address,
            companymodulemapping: resultArr[0],
            user: resultArr[2],
            companyusermapping: resultArr[1]
        }))

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

CompanyService.editCompany = async (companyId, companyDTO, user) => {

    return Company.query().findById(companyId).updateByUserId(companyDTO, user.sub).returning('*')
}

CompanyService.deleteCompany = async (companyId, user) => {

    const deleteCompany = Company.query()
        .findById(companyId)
        .deleteByUserId(user.sub)

    const deleteUserMapping = CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .deleteByUserId(user.sub)

    const deleteModuleMapping = CompanyModuleMapping.query()
        .where('ecompanyecompanyid', companyId)
        .deleteByUserId(user.sub)

    return Promise.all([deleteCompany, deleteUserMapping, deleteModuleMapping])
        .then(resultArr => resultArr[0])
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = CompanyService;