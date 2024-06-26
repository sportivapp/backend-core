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
const CompanyIndustryMapping = require('../models/CompanyIndustryMapping')
const CompanyDefaultPosition = require('../models/CompanyDefaultPosition')
const { raw, UniqueViolationError } = require('objection')
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
    INVALID_TYPE: 'INVALID_TYPE',
    INDUSTRY_NOT_PROVIDED: 'INDUSTRY_NOT_PROVIDED',
    NAME_EXISTED: 'NAME_EXISTED'
}

function isNameUniqueValidationError(e) {

    if (!e.nativeError)
        return false;

    return e.nativeError.detail.includes('ecompanyname') && e instanceof UniqueViolationError
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
        .modify('basic')
        .withGraphFetched('file')
        .joinRelated('companies')
        .withGraphFetched('grades')
        .modifyGraph('grades', builder => {
            builder.where('ecompanyecompanyid', companyId)
        })
        .where('companies.ecompanyid', companyId)
        .andWhere(raw('lower("eusername")'), 'like', `%${keyword}%`)
        .orderBy('eusercreatetime', 'ASC')
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

CompanyService.createCompany = async(companyDTO, addressDTO, industryIds, user) => {

    if (industryIds.length === 0) throw new UnsupportedOperationError(ErrorEnum.INDUSTRY_NOT_PROVIDED);

    const industry = await Industry.query().whereIn('eindustryid', industryIds);
    if (industryIds.length !== industry.length) throw new UnsupportedOperationError(ErrorEnum.INDUSTRY_NOT_FOUND);

    const companyIds = await CompanyUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(resultArr => resultArr.map(result => result.ecompanyecompanyid))

    if (companyDTO.ecompanyparentid) {
        const parent = await Company.query().findById(companyDTO.ecompanyparentid).withGraphFetched('parent')
        if (!parent) throw new UnsupportedOperationError(ErrorEnum.PARENT_NOT_FOUND)
        else if (companyIds.indexOf(parent.ecompanyid) === -1) {
            if (parent.parent && companyIds.indexOf(parent.parent.ecompanyid) === -1)
                throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)
        }
    }

    const codes = await settingService.getAllFunctions().then(funcList => funcList.map(func => func.efunctioncode))

    const memberCode = await settingService.getAllFunctions('r').then(funcList => funcList.map(func => func.efunctioncode))
    
    const modules = await settingService.getAllModules()

    return Company.transaction(async trx => {

        const address = await Address.query(trx).insertToTable(addressDTO, user.sub)
            .modify('baseAttributes')

        companyDTO.eaddresseaddressid = address.eaddressid

        const company = await Company.query(trx)
            .insertToTable(companyDTO, user.sub)
            .modify('baseAttributes')

        const companyIndustryMappings = industryIds.map(industryId => {
            return {
                ecompanyecompanyid: company.ecompanyid,
                eindustryeindustryid: industryId
            }
        });

        // TODO: Create CompanyIndustryMapping
        const insertCompanyIndustryMapping = CompanyIndustryMapping.query(trx).insertToTable(companyIndustryMappings, user.sub);

        if (companyDTO.ecompanyautonik) {
            // if (!companyDTO.ecompanynik) throw new UnsupportedOperationError(ErrorEnum.NIK_EMPTY)
            await CompanySequence.createSequence(company.ecompanyid, trx)
        }

        const companyUserMappingDTO = {
            ecompanyecompanyid: company.ecompanyid,
            eusereuserid: user.sub
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

        const memberDTO = {
            egradename: 'Member',
            egradedescription: 'Member of Company',
            ecompanyecompanyid: company.ecompanyid
        }

        let adminGradeId, memberGradeId

        const insertGradeAndFunctions = Grades.query(trx).insertToTable(gradeDTO, user.sub)
            .then(grade => ({ egradeegradeid: grade.egradeid, eusereuserid: user.sub }))
            .then(userPositionMappingDTO => UserPositionMapping.query(trx).insertToTable(userPositionMappingDTO, user.sub))
            .then(mapping =>  {
                adminGradeId = mapping.egradeegradeid
                return adminGradeId
            })
            .then(gradeId => settingService.mapFunctionsToGrade(gradeId, codes, trx))

        const insertMemberGradeAndFunction = Grades.query(trx).insertToTable(memberDTO, user.sub)
            .then(grade => {
                memberGradeId = grade.egradeid
                return memberGradeId
            })
            .then(gradeId => settingService.mapFunctionsToGrade(gradeId, memberCode, trx))

        // super user of the company
        const findUserQuery = User.query()
            .findById(user.sub)
            .modify('baseAttributes')

        return Promise.all([findUserQuery, insertCompanyModuleMappingQuery, insertCompanyUserMappingQuery, insertGradeAndFunctions, 
            insertMemberGradeAndFunction, insertCompanyIndustryMapping])
            .then(resultArr => {

                // add company default position when created
                return CompanyDefaultPosition.query(trx)
                .insertToTable({
                    ecompanyecompanyid: company.ecompanyid, 
                    eadmingradeid: adminGradeId, 
                    emembergradeid: memberGradeId
                }, user.sub)
                .then(() => resultArr)
                
            })
            .then(resultArr => ({
                company: company,
                address: address,
                user: resultArr[0],
                employeeCount: 1,
                departments: 0,
                childrenCount: 0
            }))

        }).catch(e => {
            if (isNameUniqueValidationError(e)) throw new UnsupportedOperationError(ErrorEnum.NAME_EXISTED)
            throw e
        })
}

CompanyService.getMyCompanyList = async (page, size, companyName, user) => {

    return CompanyUserMapping.relatedQuery('company')
        .for(CompanyUserMapping.query().where('eusereuserid', user.sub))
        .modify('baseAttributes')
        .where('ecompanyparentid', null)
        .where('ecompanyolderid', null)
        .whereRaw(`LOWER("ecompanyname") LIKE LOWER('%${companyName}%')`)
        .page(page, size)
        .then(companyList => ServiceHelper.toPageObj(page, size, companyList));

}

CompanyService.getMyCompanyListCount = async (user) => {

    return CompanyUserMapping.relatedQuery('company')
        .for(CompanyUserMapping.query().where('eusereuserid', user.sub))
        .count()
        .first()
}

CompanyService.getAllCompanyList = async (page, size, type, keyword, companyId, user) => {

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
            .where(raw('lower("ecompanyname")'), 'like', `%${keyword}%`)
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
        eindustryname: company.industry ? company.industry.eindustryname : ''
    }))

    const newPageObj = {
        results: result,
        total: pageObj.total
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

CompanyService.editCompany = async (companyId, companyDTO, addressDTO, industryIds, user) => {

    if (industryIds.length === 0) throw new UnsupportedOperationError(ErrorEnum.INDUSTRY_NOT_PROVIDED);

    const industry = await Industry.query().whereIn('eindustryid', industryIds);
    if (industryIds.length !== industry.length) throw new UnsupportedOperationError(ErrorEnum.INDUSTRY_NOT_FOUND);

    const companyIds = await CompanyUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(resultArr => resultArr.map(result => result.ecompanyecompanyid))

    // efileefileid null if undefined or 0 was sent
    if (companyDTO.efileefileid === undefined || companyDTO.efileefileid === 0) {
        companyDTO.efileefileid = null;
    }

    if (companyDTO.ecompanyparentid) {
        const parent = await Company.query().findById(companyDTO.ecompanyparentid).withGraphFetched('parent')
        if (!parent) throw new UnsupportedOperationError(ErrorEnum.PARENT_NOT_FOUND)
        else if (companyIds.indexOf(parent.ecompanyid) === -1) {
            if (parent.parent && companyIds.indexOf(parent.parent.ecompanyid) === -1)
                throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)
        }
    }

    const company = await Company.query().findById(companyId)

    if (!company) throw new UnsupportedOperationError(ErrorEnum.COMPANY_NOT_FOUND)

    return Company.transaction(async trx => {

        // remove all industry first
        await CompanyIndustryMapping.query(trx)
        .where('ecompanyecompanyid', companyId)
        .delete()

        const companyIndustryMappings = industryIds.map(industryId => {
            return {
                ecompanyecompanyid: company.ecompanyid,
                eindustryeindustryid: industryId
            }
        });

        // TODO: Create CompanyIndustryMapping
        const insertCompanyIndustryMapping = CompanyIndustryMapping.query(trx).insertToTable(companyIndustryMappings, user.sub);

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

        return Promise.all([getCompanyQuery, employeeCount, departmentCount, branchCount, insertCompanyIndustryMapping])
            .then(resultArr => ({
                ...resultArr[0],
                employeeCount: parseInt(resultArr[1][0].count),
                departmentCount: parseInt(resultArr[2][0].count),
                childrenCount: parseInt(resultArr[3][0].count)
            }))

    }).catch(e => {
        if (isNameUniqueValidationError(e)) throw new UnsupportedOperationError(ErrorEnum.NAME_EXISTED)
        throw e
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

CompanyService.deleteCompanyWithDbObject = async (companyId, db = Company.knex()) => {

    await CompanySequence.deleteSequence(companyId, db)

    await CompanyModuleMapping.query(db)
        .where('ecompanyecompanyid', companyId)
        .del()

    return Company.query(db)
        .findById(companyId)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
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

CompanyService.getAllCompanies = async (page, size, keyword, categoryId, excludedCompanyIds) => {

    if (categoryId)
        return CompanyIndustryMapping.relatedQuery('company')
            .for(CompanyIndustryMapping.query().where('eindustryeindustryid', categoryId))
            .select(Company.relatedQuery('users').count().as('memberCount'))
            .modify('baseAttributes')
            .where(raw('lower(ecompanyname)'), 'like', `%${keyword.toLowerCase()}%`)
            .whereNotIn('ecompanyid', excludedCompanyIds)
            .page(page, size)

     else
        return Company.query()
            .select(Company.relatedQuery('users').count().as('memberCount'))
            .modify('baseAttributes')
            .where(raw('lower(ecompanyname)'), 'like', `%${keyword.toLowerCase()}%`)
            .whereNotIn('ecompanyid', excludedCompanyIds)
            .page(page, size)
}

CompanyService.getMemberCount = async (companyId) => {

    return Company.relatedQuery('users')
        .for(companyId)
        .count()
        .first()
        .then(result => result.count)
}

CompanyService.getDefaultPositions = async (companyId) => {

    return CompanyDefaultPosition.query()
        .where('ecompanyecompanyid', companyId)
        .first()
        .then(defaultPositionObj => {
            if (!defaultPositionObj) throw new NotFoundError()
            return defaultPositionObj
        })
}

module.exports = CompanyService;