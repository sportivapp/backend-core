const Company = require('../models/Company');
const Address = require('../models/Address');
const departmentService = require('./departmentService')
const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyModuleMapping = require('../models/CompanyModuleMapping')
const Module = require('../models/Module')
const { raw } = require('objection')
const jwt = require('jsonwebtoken')
const ServiceHelper = require('../helper/ServiceHelper')

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

    const departmentDTO = {
        edepartmentname: 'DEFAULT DEPARTMENT',
        edepartmentdescription: 'Defaut Deparment for Company',
        ecompanyecompanyid: company.ecompanyid
    }

    const loggedInUser = { sub: user.euserid, companyId: company.ecompanyid }

    const createDefaultDepartment = departmentService.createDepartment(departmentDTO, loggedInUser)

    return Promise.all([insertCompanyModuleMappingQuery, insertCompanyUserMappingQuery, createDefaultDepartment])
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

    const departmentDTO = {
        edepartmentname: 'DEFAULT DEPARTMENT',
        edepartmentdescription: 'Defaut Deparment for Company',
        ecompanyecompanyid: company.ecompanyid
    }

    const createDefaultDepartment = departmentService.createDepartment(departmentDTO, user)

    // super user of the company
    const findUserQuery = User.query()
        .findById(id)

    return Promise.all([findUserQuery, insertCompanyModuleMappingQuery, insertCompanyUserMappingQuery, createDefaultDepartment])
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

    let query

    if (type === 'SISTER' || type === 'BRANCH') {

        query = Company.query().orderBy('ecompanycreatetime', 'ASC')

        if (type === 'BRANCH') {
            if (!companyId) return ServiceHelper.toEmptyPage(page, size)
            query = query.where('ecompanyparentid', companyId).whereNull('ecompanyolderid')
        }

        else if (type === 'SISTER') {
            if (!companyId) return ServiceHelper.toEmptyPage(page, size)
            query = query
                .where('ecompanyolderid', companyId)
                .whereNull('ecompanyparentid')
                .withGraphFetched('[branches, sisters, industry]')
        }

    } else {

        query = User.relatedQuery('companies')
            .for(user.sub)
            .modify({ ecompanyusermappingdeletestatus: false })
            .where(raw('lower("ecompanyname")'), 'like', `%${newKeyword}%`)
            .whereNull('ecompanyparentid')
            .whereNull('ecompanyolderid')
            .withGraphFetched('[branches, sisters, industry]')
            .orderBy('ecompanyusermappingcreatetime', 'ASC')
    }

    const pageObj = await query.page(page, size)

    return ServiceHelper.toPageObj(page, size, pageObj)

}

CompanyService.getCompanyById = async (companyId) => {

    const company = await Company.query().findById(companyId).withGraphFetched('industry')

    const employeeCount = CompanyUserMapping.query().where('ecompanyecompanyid', companyId).count()
    const departmentCount = Company.relatedQuery('departments').for(companyId).count()
    const branchCount = Company.relatedQuery('branches').for(companyId).count()

    return Promise.all([company, employeeCount, departmentCount, branchCount])
        .then(resultArr => ({
            ...resultArr[0],
            employeeCount: parseInt(resultArr[1][0].count),
            departmentCount: parseInt(resultArr[2][0].count),
            childrenCount: parseInt(resultArr[3][0].count)
        }))
}

CompanyService.editCompany = async (companyId, supervisorId, companyDTO, user) => {

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

    if (supervisorId) {

        const deleteCurrentHeadQuery = CompanyUserMapping.query()
            .where('ecompanyecompanyid', companyId)
            .where('ecompanyusermappingpermission', 10)
            .delete()

        const companyUserMappingDTO = {
            ecompanyecompanyid: companyId,
            eusereuserid: supervisorId,
            ecompanyusermappingpermission: 10
        }

        const insertNewHeadQuery = CompanyUserMapping.query()
            .insertToTable(companyUserMappingDTO, user.sub)

        await Promise.all([deleteCurrentHeadQuery, insertNewHeadQuery])
    }

    await Company.query().findById(companyId).updateByUserId(companyDTO, user.sub)

    const company = Company.query().findById(companyId).withGraphFetched('industry')

    const employeeCount = CompanyUserMapping.query().where('ecompanyecompanyid', companyId).count()
    const departmentCount = Company.relatedQuery('departments').for(companyId).count()
    const branchCount = Company.relatedQuery('branches').for(companyId).count()

    return Promise.all([company, employeeCount, departmentCount, branchCount])
        .then(resultArr => ({
            ...resultArr[0],
            employeeCount: resultArr[1].count,
            departmentCount: resultArr[2].count,
            childrenCount: resultArr[3].count
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