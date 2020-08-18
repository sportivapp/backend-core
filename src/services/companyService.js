const Company = require('../models/Company');
const Address = require('../models/Address');
const Industry = require('../models/Industry')
const departmentService = require('./departmentService')
const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyModuleMapping = require('../models/CompanyModuleMapping')
const Module = require('../models/Module')
const { raw } = require('objection')
const jwt = require('jsonwebtoken')
const ServiceHelper = require('../helper/ServiceHelper')
const fileService = require('./mobileFileService');

const CompanyService = {};

CompanyService.registerCompany = async(userDTO, companyDTO, addressDTO) => {

    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);
    const user = await User.query().insertToTable(userDTO);

    const address = await Address.query().insertToTable(addressDTO, user.euserid);

    companyDTO.eaddresseaddressid = address.eaddressid;
    companyDTO.ecompanycreateby = 0;
    const company = await Company.query().insertToTable(companyDTO, user.euserid);

    // super user of the company

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
        .then(modules => CompanyModuleMapping.query().insertToTable(modules, user.euserid))


    const insertCompanyUserMappingQuery = CompanyUserMapping.query().insertToTable(companyUserDTO, user.euserid)

    return Promise.all([insertCompanyModuleMappingQuery, insertCompanyUserMappingQuery])
        .then(ignored => ({
            user: user,
            company: company,
            address: address,
            employeeCount: 1,
            departmentCount: 1
        }))

}

CompanyService.getUsersByCompanyId = async(companyId, page, size) => {

    return Company.relatedQuery('users')
        .for(companyId)
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

CompanyService.getAllCompanyByUserId = async(userId) => {

    const result = await User.relatedQuery('companies')
    .for(userId)
    .modify({ ecompanyusermappingdeletestatus: false })
    .where('ecompanyparentid', null)
    .orderBy('ecompanyusermappingcreatetime', 'ASC')
    .withGraphFetched('[branches, sisters]')

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

    const address = await Address.query().insertToTable(addressDTO, user.sub);

    if (companyDTO.ecompanyolderid && companyDTO.ecompanyparentid) return

    else if (companyDTO.ecompanyolderid) {
        const olderSister = await Company.query().findById(companyDTO.ecompanyolderid)
        if (!olderSister) return
    }

    else if (companyDTO.ecompanyparentid) {
        const parent = await Company.query().findById(companyDTO.ecompanyparentid)
        if (!parent) return
    }

    if (companyDTO.eindustryeindustryid) {
        const industry = await Industry.query().findById(companyDTO.eindustryeindustryid)
        if (!industry) return
    }

    companyDTO.eaddresseaddressid = address.eaddressid;
    const company = await Company.query().insertToTable(companyDTO, user.sub);

    const id = ( isNaN(userId) ) ? parseInt(user.sub) : userId

    const companyUserMappingDTO = {
        ecompanyecompanyid: company.ecompanyid,
        eusereuserid: id,
        ecompanyusermappingpermission: 10
    }

    const insertCompanyModuleMappingQuery = Module.query()
        .then(modules => {
            return modules.map(module => ({
                ecompanymodulemappingname: module.emodulename,
                ecompanyecompanyid: company.ecompanyid,
                emoduleemoduleid: module.emoduleid
            }))
        })
        .then(modules => CompanyModuleMapping.query().insertToTable(modules, user.sub))

    const insertCompanyUserMappingQuery = CompanyUserMapping.query().insertToTable(companyUserMappingDTO, user.sub)

    // super user of the company
    const findUserQuery = User.query()
        .findById(id)

    return Promise.all([findUserQuery, insertCompanyModuleMappingQuery, insertCompanyUserMappingQuery])
        .then(resultArr => ({
            company: company,
            address: address,
            user: resultArr[0],
            employeeCount: 1,
            departments: 1,
            childrenCount: 0
        }))

}

CompanyService.getCompanyList = async (page, size, type, keyword, companyId, user) => {

    let newKeyword

    if (keyword)
        newKeyword = keyword.toLowerCase()
    else
        newKeyword = ''

    const companyIds = await CompanyUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(resultArr => resultArr.map(result => result.ecompanyecompanyid))

    if (companyId) {
        if (companyIds.indexOf(parseInt(companyId)) === -1) return ServiceHelper.toEmptyPage(page, size)
    }

    let query

    if (type === 'SISTER' || type === 'BRANCH') {

        query = Company.query()
        .orderBy('ecompanycreatetime', 'ASC')


        if (type === 'BRANCH') {
            if (!companyId) return ServiceHelper.toEmptyPage(page, size)
            query = query
            .where('ecompanyparentid', companyId)
            .whereNull('ecompanyolderid')
            .withGraphFetched('[branches, industry, address.[state, country]]')

        }

        else if (type === 'SISTER') {
            if (!companyId) return ServiceHelper.toEmptyPage(page, size)
            query = query
                .where('ecompanyolderid', companyId)
                .whereNull('ecompanyparentid')
                .withGraphFetched('[branches, sisters.industry, industry, address.[state, country]]')
        }

    } else {

        query = User.relatedQuery('companies')
            .for(user.sub)
            .modify({ ecompanyusermappingdeletestatus: false })
            .where(raw('lower("ecompanyname")'), 'like', `%${newKeyword}%`)
            .whereNull('ecompanyparentid')
            .whereNull('ecompanyolderid')
            .whereIn('ecompanyid', companyIds)
            .withGraphFetched('[branches, sisters.industry, industry, address.[state, country]]')
            .orderBy('ecompanyusermappingcreatetime', 'ASC')
    }

    const pageObj = await query.page(page, size)
    
    const result = pageObj.results.map(company => ({
        ...company,
        childrenCount: company.branches.length,
        eindustryname: company.industry.eindustryname
    }))

    const newPageObj = {
        results: result,
        page: page,
        size: size,
        totalSize: pageObj.total
    }

    return ServiceHelper.toPageObj(page, size, newPageObj)

}

CompanyService.getCompanyById = async (companyId) => {

    const company = await Company.query().findById(companyId).withGraphFetched('[industry,address.[country,state]]')

    const headUserId = await CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .where('ecompanyusermappingpermission', 10)
        .first()
        .then(result => result.eusereuserid)

    const employeeCount = CompanyUserMapping.query().where('ecompanyecompanyid', companyId).count()
    const departmentCount = Company.relatedQuery('departments').for(companyId).count()
    const branchCount = Company.relatedQuery('branches').for(companyId).count()
    const head = User.query().findById(headUserId)

    return Promise.all([company, employeeCount, departmentCount, branchCount, head])
        .then(resultArr => ({
            ...resultArr[0],
            user: resultArr[4],
            employeeCount: parseInt(resultArr[1][0].count),
            departmentCount: parseInt(resultArr[2][0].count),
            childrenCount: parseInt(resultArr[3][0].count)
        }))
}

CompanyService.editCompany = async (companyId, supervisorId, companyDTO, addressDTO, user) => {

    // if fileid is not given on update, delete the file
    if (companyDTO.efileefileid === undefined || companyDTO.efileefileid === 0) {
        companyDTO.efileefileid = null;
    }

    if (companyDTO.ecompanyolderid && companyDTO.ecompanyparentid) return

    if (companyDTO.ecompanyolderid) {
        const olderSister = await Company.query().findById(companyDTO.ecompanyolderid)
        if (!olderSister) return
    }

    if (companyDTO.ecompanyparentid) {
        const parent = await Company.query().findById(companyDTO.ecompanyparentid)
        if (!parent) return
    }

    if (companyDTO.eindustryeindustryid) {
        const industry = await Industry.query().findById(companyDTO.eindustryeindustryid)
        if (!industry) return
    }

    let headUserId

    if (supervisorId) {

        const deleteCurrentHeadQuery = CompanyUserMapping.query()
            .where('ecompanyecompanyid', companyId)
            .where('ecompanyusermappingpermission', 10)
            .delete()

        const companyUserMappingDTO = {
            ecompanyecompanyid: parseInt(companyId),
            eusereuserid: supervisorId,
            ecompanyusermappingpermission: 10
        }

        const insertNewHeadQuery = CompanyUserMapping.query()
            .insertToTable(companyUserMappingDTO, user.sub)

        headUserId = await Promise.all([deleteCurrentHeadQuery, insertNewHeadQuery])
            .then(resultArr => resultArr[1])
            .then(result => result.eusereuserid)
    } else {
        headUserId = await CompanyUserMapping.query()
            .where('ecompanyecompanyid', companyId)
            .where('ecompanyusermappingpermission', 10)
            .first()
            .then(result => result.eusereuserid)
    }

    const company = await Company.query().findById(companyId)

    const updateAdress = (addressId) => Address.query()
        .where('eaddressid', addressId)
        .updateByUserId(addressDTO, user.sub)

    const updateCompany = (company) => company.$query().updateByUserId(companyDTO, user.sub)

    await Promise.all([updateAdress(company.eaddresseaddressid), updateCompany(company)])

    const employeeCount = CompanyUserMapping.query().where('ecompanyecompanyid', companyId).count()
    const departmentCount = Company.relatedQuery('departments').for(companyId).count()
    const branchCount = Company.relatedQuery('branches').for(companyId).count()

    const getUserQuery = User.query().findById(headUserId)
    const getCompanyQuery = Company.query().findById(companyId)
        .withGraphFetched('[industry,address]')

    // User didnt give a file and file existed (delete file)
    if (company.efileefileid && companyDTO.efileefileid === null) {
        await fileService.deleteFileById(company.efileefileid);
    }
    // User give a file
    else if (companyDTO.efileefileid) {
        
        // File does not exist / not uploaded yet
        const file = await fileService.getFileById(companyDTO.efileefileid);

        if (!file)
            return

        const newPathDir = '/company/' + company.ecompanyid;
        await fileService.moveFile(file, newPathDir);
    }

    return Promise.all([getCompanyQuery, employeeCount, departmentCount, branchCount, getUserQuery])
        .then(resultArr => ({
            ...resultArr[0],
            user: resultArr[4],
            employeeCount: parseInt(resultArr[1][0].count),
            departmentCount: parseInt(resultArr[2][0].count),
            childrenCount: parseInt(resultArr[3][0].count)
        }))

}

CompanyService.deleteCompany = async (companyId) => {

    const deleteCompany = Company.query()
        .findById(companyId)
        .delete()

    const deleteUserMapping = CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .delete()

    const deleteModuleMapping = CompanyModuleMapping.query()
        .where('ecompanyecompanyid', companyId)
        .delete()

    return Promise.all([deleteUserMapping, deleteModuleMapping, deleteCompany])
        .then(resultArr => resultArr[2])
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = CompanyService;