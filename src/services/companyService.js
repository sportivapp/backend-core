const Company = require('../models/Company');
const Address = require('../models/Address');
const Industry = require('../models/Industry')
const User = require('../models/User');
const Grades = require('../models/Grades')
const UserPositionMapping = require('../models/UserPositionMapping')
const bcrypt = require('../helper/bcrypt');
const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyModuleMapping = require('../models/CompanyModuleMapping')
const CompanySequence = require('../models/CompanySequence')
const { raw } = require('objection')
const ServiceHelper = require('../helper/ServiceHelper')
const settingService = require('./settingService')
const fileService = require('./fileService');
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')

const CompanyService = {};

const ErrorEnum = {
    COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
    SISTER_NOT_FOUND: 'SISTER_NOT_FOUND',
    PARENT_NOT_FOUND: 'PARENT_NOT_FOUND',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    INDUSTRY_NOT_FOUND: 'INDUSTRY_NOT_FOUND',
    NIK_EMPTY: 'NIK_EMPTY',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    INVALID_TYPE: 'INVALID_TYPE'
}

CompanyService.registerCompany = async(userDTO, companyDTO, addressDTO) => {

    return Company.transaction(async trx => {

        userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);
        const user = await User.query(trx).insertToTable(userDTO, 0);

        const address = await Address.query(trx).insertToTable(addressDTO, user.euserid);

        companyDTO.eaddresseaddressid = address.eaddressid;
        companyDTO.ecompanycreateby = 0;
        const company = await Company.query(trx)
            .insertToTable(companyDTO, user.euserid)
            .withGraphFetched('logo(baseAttributes)');

        if (companyDTO.ecompanyautonik) {
            if (!companyDTO.ecompanynik) throw new UnsupportedOperationError(ErrorEnum.NIK_EMPTY)
            await CompanySequence.createSequence(company.ecompanyid, trx)
        }

        const gradeDTO = {
            egradename: 'Super Admin',
            egradedescription: 'Administrator',
            ecompanyecompanyid: company.ecompanyid
        }

        const grade = await Grades.query(trx).insertToTable(gradeDTO, user.euserid)
            .then(grade => UserPositionMapping.query(trx).insertToTable(
                {
                    egradeegradeid: grade.egradeid,
                    eusereuserid: user.euserid
                }, user.euserid).then(ignored => grade))

        const insertFunctionCodes = settingService.getAllFunctions().then(func => func.efunctioncode)
            .then(codes => settingService.mapFunctionsToGrade(grade.egradeid, codes, trx))

        // super user of the company
        const companyUserDTO = {
            eusereuserid: user.euserid,
            ecompanyecompanyid: company.ecompanyid,
            ecompanyusermappingcreateby: 0
        }

        const insertCompanyModuleMappingQuery = settingService.getAllModules()
            .then(modules => {
                return modules.map(module => ({
                    ecompanymodulemappingname: module.emodulename,
                    ecompanyecompanyid: company.ecompanyid,
                    emoduleemoduleid: module.emoduleid
                }))
            })
            .then(modules => CompanyModuleMapping.query(trx).insertToTable(modules, user.euserid))


        const insertCompanyUserMappingQuery = CompanyUserMapping.query(trx).insertToTable(companyUserDTO, user.euserid)

        return Promise.all([insertCompanyModuleMappingQuery, insertCompanyUserMappingQuery, insertFunctionCodes])
            .then(ignored => ({
                user: user,
                company: company,
                address: address,
                employeeCount: 1,
                departmentCount: 1
            }))
    })
}

CompanyService.getUsersByCompanyId = async(companyId, page, size, keyword) => {

    return User.query()
        .withGraphFetched('file')
        .joinRelated('companies')
        .withGraphFetched('grades')
        .modifyGraph('grades', builder => {
            builder.where('ecompanyecompanyid', companyId)
        })
        .where('companies.ecompanyid', companyId)
        .andWhere(raw('lower("eusername")'), 'like', `%${keyword}%`)
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

CompanyService.getAllCompanyByUserId = async(userId) => {

    return User.relatedQuery('companies')
        .for(userId)
        .modify({ ecompanyusermappingdeletestatus: false })
        .where('ecompanyparentid', null)
        .orderBy('ecompanyusermappingcreatetime', 'ASC')
        .withGraphFetched('[branches(baseAttributes), sisters(baseAttributes), logo(baseAttributes)]');

}

CompanyService.saveUsersToCompany = async(companyId, users, loggedInUser) => {

    const company = await Company.query().findById(companyId)

    if(!company)
        throw new UnsupportedOperationError(ErrorEnum.COMPANY_NOT_FOUND)

    const deletedUserIds = users.filter(user => user.deleted).map(user => user.id)

    const insertedUserIds = users.filter(user => !user.deleted).map(user => user.id)

    return CompanyUserMapping.transaction(async trx => {

        await CompanyUserMapping.query(trx)
            .where('ecompanyecompanyid', companyId)
            .whereIn('eusereuserid', deletedUserIds)
            .del()

        const existedUserIds = await CompanyUserMapping.query(trx)
            .where('ecompanyecompanyid', companyId)
            .then(list => list.map(mapping => mapping.eusereuserid))

        const newMappingDTOs = insertedUserIds.filter(userId => !existedUserIds.find(id => id === userId))
            .map(userId => ({ ecompanyecompanyid: companyId, eusereuserid: userId }))

        if (newMappingDTOs.length > 0)

            return CompanyUserMapping.query(trx).insertToTable(newMappingDTOs, loggedInUser.sub)
                .then(mappings => mappings.map(mapping => mapping.eusereuserid))
                .then(userIds => existedUserIds.concat(userIds))

        else

            return existedUserIds

    })
}

CompanyService.createCompany = async(userId, companyDTO, addressDTO, user) => {

    const companyIds = await CompanyUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(resultArr => resultArr.map(result => result.ecompanyecompanyid))

    if (companyDTO.ecompanyolderid && companyDTO.ecompanyparentid) throw new UnsupportedOperationError(ErrorEnum.INVALID_TYPE)

    else if (companyDTO.ecompanyolderid) {
        const olderSister = await Company.query().findById(companyDTO.ecompanyolderid)
        if (!olderSister) throw new UnsupportedOperationError(ErrorEnum.SISTER_NOT_FOUND)
        if (companyIds.indexOf(companyDTO.ecompanyolderid) === -1) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)
    }

    else if (companyDTO.ecompanyparentid) {
        const parent = await Company.query().findById(companyDTO.ecompanyparentid).withGraphFetched('parent')
        if (!parent) throw new UnsupportedOperationError(ErrorEnum.PARENT_NOT_FOUND)
        else if (companyIds.indexOf(parent.ecompanyid) === -1) {
            if (parent.parent && companyIds.indexOf(parent.parent.ecompanyid) === -1)
                throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)
        }
    }

    if (companyDTO.eindustryeindustryid) {
        const industry = await Industry.query().findById(companyDTO.eindustryeindustryid)
        if (!industry) throw new UnsupportedOperationError(ErrorEnum.INDUSTRY_NOT_FOUND)
    }

    if (companyDTO.efileefileid) {
        const logo = await fileService.getFileById(companyDTO.efileefileid)
        if (!logo) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)
    }

    const codes = await settingService.getAllFunctions().then(funcList => funcList.map(func => func.efunctioncode))

    const modules = await settingService.getAllModules()

    return Company.transaction(async trx => {

        const address = await Address.query(trx).insertToTable(addressDTO, user.sub)

        companyDTO.eaddresseaddressid = address.eaddressid

        const company = await Company.query(trx)
            .insertToTable(companyDTO, user.sub)
            .withGraphFetched('logo(baseAttributes)');

        if (companyDTO.ecompanyautonik) {
            if (!companyDTO.ecompanynik) throw new UnsupportedOperationError(ErrorEnum.NIK_EMPTY)
            await CompanySequence.createSequence(company.ecompanyid, trx)
        }

        const id = ( isNaN(userId) ) ? parseInt(user.sub) : userId

        const companyUserMappingDTO = {
            ecompanyecompanyid: company.ecompanyid,
            eusereuserid: id
        }

        const companyModuleDTOs = modules.map(module => ({
            ecompanymodulemappingname: module.emodulename,
            ecompanyecompanyid: company.ecompanyid,
            emoduleemoduleid: module.emoduleid
        }))

        const insertCompanyModuleMappingQuery = CompanyModuleMapping.query(trx).insertToTable(companyModuleDTOs, user.sub)

        const insertCompanyUserMappingQuery = CompanyUserMapping.query(trx).insertToTable(companyUserMappingDTO, user.sub)

        const gradeDTO = {
            egradename: 'Administrator',
            egradedescription: 'Administrator of Company',
            ecompanyecompanyid: company.ecompanyid
        }

        const insertGradeAndFunctions = Grades.query(trx).insertToTable(gradeDTO, user.sub)
            .then(grade => ({ egradeegradeid: grade.egradeid, eusereuserid: user.sub }))
            .then(userPositionMappingDTO => UserPositionMapping.query(trx).insertToTable(userPositionMappingDTO, user.sub))
            .then(mapping => mapping.egradeegradeid)
            .then(gradeId => settingService.mapFunctionsToGrade(gradeId, codes, trx))

        // super user of the company
        const findUserQuery = User.query()
            .findById(id)

        return Promise.all([findUserQuery, insertCompanyModuleMappingQuery, insertCompanyUserMappingQuery, insertGradeAndFunctions])
            .then(resultArr => ({
                company: company,
                address: address,
                user: resultArr[0],
                employeeCount: 1,
                departments: 1,
                childrenCount: 0
            }))

        })
}

CompanyService.getCompanyList = async (page, size, type, keyword, companyId, user) => {

    const companyIds = await CompanyUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(resultArr => resultArr.map(result => result.ecompanyecompanyid))

    if (companyId) {
        if (companyIds.indexOf(companyId) === -1) return ServiceHelper.toEmptyPage(page, size)
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
            .withGraphFetched('[branches(baseAttributes), ' +
                'industry(baseAttributes), ' +
                'address.[state, country], ' +
                'logo(baseAttributes)]')

        }

        else if (type === 'SISTER') {
            if (!companyId) return ServiceHelper.toEmptyPage(page, size)
            query = query
                .where('ecompanyolderid', companyId)
                .whereNull('ecompanyparentid')
                .withGraphFetched('[branches(baseAttributes), ' +
                    'sisters(baseAttributes).industry(baseAttributes), ' +
                    'industry(baseAttributes), ' +
                    'address.[state, country],' +
                    'logo(baseAttributes)]')
        }

    } else {

        query = User.relatedQuery('companies')
            .for(user.sub)
            .modify({ ecompanyusermappingdeletestatus: false })
            .where(raw('lower("ecompanyname")'), 'like', `%${newKeyword}%`)
            .whereNull('ecompanyparentid')
            .whereNull('ecompanyolderid')
            .whereIn('ecompanyid', companyIds)
            .withGraphFetched('[branches(baseAttributes), ' +
                'sisters(baseAttributes).industry(baseAttributes), ' +
                'industry(baseAttributes), address.[state, country],' +
                'logo(baseAttributes)]')
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

CompanyService.getCompleteCompanyById = async (companyId) => {

    const company = await Company.query().findById(companyId)
        .withGraphFetched('[industry(baseAttributes), ' +
        'address.[country,state], ' +
        'logo(baseAttributes)]')
        .then(company => {
            if (!company) throw new NotFoundError()
            return company
        })

    const headUser = Grades.query().where('ecompanyecompanyid', companyId)
        .orderBy('egradecreatetime', 'ASC')
        .first()
        .then(position => {
            if (!position) return
            return position.$query()
                .select('userMappings:user.*')
                .joinRelated('userMappings.user(baseAttributes)')
                .orderBy('euserpositionmappingcreatetime', 'ASC')
                .first()
        })

    const employeeCount = CompanyUserMapping.query().where('ecompanyecompanyid', companyId).count()
    const departmentCount = Company.relatedQuery('departments').for(companyId).count()
    const branchCount = Company.relatedQuery('branches').for(companyId).count()

    return Promise.all([company, employeeCount, departmentCount, branchCount, headUser])
        .then(resultArr => ({
            ...resultArr[0],
            user: resultArr[4],
            employeeCount: parseInt(resultArr[1][0].count),
            departmentCount: parseInt(resultArr[2][0].count),
            childrenCount: parseInt(resultArr[3][0].count)
        }))
}

CompanyService.editCompany = async (companyId, supervisorId, companyDTO, addressDTO, user) => {

    const companyIds = await CompanyUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(resultArr => resultArr.map(result => result.ecompanyecompanyid))

    // efileefileid null if undefined or 0 was sent
    if (companyDTO.efileefileid === undefined || companyDTO.efileefileid === 0) {
        companyDTO.efileefileid = null;
    }

    if (companyDTO.ecompanyolderid && companyDTO.ecompanyparentid)
        throw new UnsupportedOperationError(ErrorEnum.INVALID_TYPE)

    else if (companyDTO.ecompanyolderid) {
        const olderSister = await Company.query().findById(companyDTO.ecompanyolderid)
        if (!olderSister) throw new UnsupportedOperationError(ErrorEnum.SISTER_NOT_FOUND)
        if (companyIds.indexOf(companyDTO.ecompanyolderid) === -1) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)
    }

    else if (companyDTO.ecompanyparentid) {
        const parent = await Company.query().findById(companyDTO.ecompanyparentid).withGraphFetched('parent')
        if (!parent) throw new UnsupportedOperationError(ErrorEnum.PARENT_NOT_FOUND)
        else if (companyIds.indexOf(parent.ecompanyid) === -1) {
            if (parent.parent && companyIds.indexOf(parent.parent.ecompanyid) === -1)
                throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)
        }
    }

    if (companyDTO.eindustryeindustryid) {
        const industry = await Industry.query().findById(companyDTO.eindustryeindustryid)
        if (!industry) throw new UnsupportedOperationError(ErrorEnum.INDUSTRY_NOT_FOUND)
    }

    let headUser

    const company = await Company.query().findById(companyId)

    if (!company) throw new UnsupportedOperationError(ErrorEnum.COMPANY_NOT_FOUND)

    return Company.transaction(async trx => {

        if (supervisorId) {

            const superAdminPosition = await Grades.query().where('ecompanyecompanyid', companyId)
                .orderBy('egradecreatetime', 'ASC')
                .first()

            headUser = await UserPositionMapping.query(trx)
                .where('egradeegradeid', superAdminPosition.egradeid)
                .first()
                .updateByUserId({ eusereuserid: supervisorId }, user.sub)
                .returning('eusereuserid')
                .then(result => User.query().findById(result.eusereuserid))

        } else {
            headUser = await Grades.query().where('ecompanyecompanyid', companyId)
            .orderBy('egradecreatetime', 'ASC')
            .first()
            .then(position => position
                .$relatedQuery('users')
                .orderBy('eusercreatetime', 'ASC')
                .first()
            )
        }

        const updateAdress = (addressId) => Address.query(trx)
            .where('eaddressid', addressId)
            .updateByUserId(addressDTO, user.sub)

        const updateCompany = (company) => company.$query(trx).updateByUserId(companyDTO, user.sub)

        await Promise.all([updateAdress(company.eaddresseaddressid), updateCompany(company)])

        const employeeCount = CompanyUserMapping.query().where('ecompanyecompanyid', companyId).count()
        const departmentCount = Company.relatedQuery('departments').for(companyId).count()
        const branchCount = Company.relatedQuery('branches').for(companyId).count()
        const getCompanyQuery = Company.query().findById(companyId)
            .withGraphFetched('[industry(baseAttributes), address.[country, state], logo(baseAttributes)]')

        return Promise.all([getCompanyQuery, employeeCount, departmentCount, branchCount])
            .then(resultArr => ({
                ...resultArr[0],
                user: headUser,
                employeeCount: parseInt(resultArr[1][0].count),
                departmentCount: parseInt(resultArr[2][0].count),
                childrenCount: parseInt(resultArr[3][0].count)
            }))

    })
}

CompanyService.deleteCompany = async (companyId) => {

    return Company.transaction(async trx => {

        await CompanySequence.deleteSequence(companyId, trx)

        await CompanyModuleMapping.query(trx)
            .where('ecompanyecompanyid', companyId)
            .del()

        return Company.query(trx)
            .findById(companyId)
            .delete()
            .then(rowsAffected => rowsAffected === 1)
    })
}

CompanyService.getCompanyById = async (companyId) => {
    return Company.query()
        .findById(companyId)
}

CompanyService.isUserExistInCompany = async (companyId, userId) => {
    return CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .where('eusereuserid', userId)
        .first()
        .then(data => !!data)
}

module.exports = CompanyService;