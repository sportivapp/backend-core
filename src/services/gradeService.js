const Grade = require('../models/Grades')
const User = require('../models/User')
const Department = require('../models/Department')
const Company = require('../models/Company')
const UserPositionMapping = require('../models/UserPositionMapping')
const ServiceHelper = require('../helper/ServiceHelper')

const gradeService = {}

gradeService.getAllGrades = async (page, size, companyId, departmentId) => {

    if (departmentId) {

        const department = Department.query().findById(departmentId)
        if (!department) return ServiceHelper.toEmptyPage(page, size)

        const gradePage = await Grade.query()
            .where('edepartmentedepartmentid', departmentId)
            .withGraphFetched('[superior,department.parent.parent,company.parent.parent]')
            .page(page, size)
        return ServiceHelper.toPageObj(page, size, gradePage)

    } else {

        const company = await Company.query().findById(companyId)

        if (!company) return ServiceHelper.toEmptyPage(page, size)

        const branchIds = await Company.relatedQuery('branches')
            .for(companyId)
            .withGraphFetched('branches')
            .then(companies => {
                let ids = []
                ids.push(companyId)
                companies.forEach(company => {
                    ids.push(company.ecompanyid)
                    company.branches.forEach(branch => ids.push(branch.ecompanyid))
                })
                return ids
            })

        const gradePage = await Grade.query()
            .whereIn('ecompanyecompanyid', branchIds)
            .withGraphFetched('[superior,department.parent.parent,company.parent.parent]')
            .page(page, size)
        return ServiceHelper.toPageObj(page, size, gradePage)

    }
}

gradeService.getGradeById = async (gradeId) => {
    return Grade.query().findById(gradeId)
        .withGraphFetched('[superior,department.parent.parent,company.parent.parent]')
}

gradeService.createGrade = async (gradeDTO, userId) => {

    if (gradeDTO.egradesuperiorid) {
        const superior = await gradeService.getGradeById(gradeDTO.egradesuperiorid)
        if (!superior) return
    }

    const company = await Company.query().findById(gradeDTO.ecompanyecompanyid)
    if (!company) return

    if (gradeDTO.edepartmentedepartmentid) {
        const department = await Department.query().findById(gradeDTO.edepartmentedepartmentid)
        if (!department) return
    }

    return Grade.query().insertToTable(gradeDTO, userId)
}

gradeService.updateGradeById = async (gradeId, gradeDTO, user) => {

    if (gradeDTO.egradesuperiorid) {
        const superior = await gradeService.getGradeById(gradeDTO.egradesuperiorid)
        if (!superior) return
    }

    if (gradeDTO.ecompanyecompanyid) {
        const company = await Company.query().findById(gradeDTO.ecompanyecompanyid)
        if (!company) return
    }

    const grade = await gradeService.getGradeById(gradeId)

    if (grade.edepartmentedepartmentid !== gradeDTO.edepartmentedepartmentid) {

        if (gradeDTO.edepartmentedepartmentid !== null) {

            const department = await Department.query().findById(gradeDTO.edepartmentedepartmentid)

            if (!department) return
        }

        return UserPositionMapping.query().where('egradeegradeid', grade.egradeid)
            .updateByUserId({ edepartmentedepartmentid: gradeDTO.edepartmentedepartmentid }, user.sub)
            .then(ignored => grade.$query().updateByUserId(gradeDTO, user.sub).returning('*'))
    }

    return grade.$query().updateByUserId(gradeDTO, user.sub).returning('*')
}

gradeService.deleteGradeById = async (gradeId, user) => {

    const grade = await Grade.query().findById(gradeId)
    
    if(!grade)
        return false

    const subordinates = await Grade.relatedQuery('subordinates')
        .for(grade.egradeid)

    const gradeIds = subordinates
        .map(subordinate => subordinate.egradeid)

    let superiorId = null

    if( grade.egradesuperiorid !== null)
        superiorId = await Grade.query().select()
            .where('egradeid', grade.egradesuperiorid)
            .first()
            .then(superior => superior ? superior.egradeid : null)

    return Grade.query()
        .whereIn('egradeid', gradeIds)
        .updateByUserId({ egradesuperiorid: superiorId }, user.sub)
        .then(ignored => grade.$query().delete().then(rowsAffected => rowsAffected === 1))
}

gradeService.saveUserPositions = async (userIds, positionId, loggedInUser) => {

    await UserPositionMapping.query()
    .where('egradeegradeid', positionId)
    .delete()

    const grade = await gradeService.getGradeById(positionId)

    if (!grade) return

    const users = userIds.map(userId => 
        ({ 
            eusereuserid: parseInt(userId),
            egradeegradeid: positionId,
            edepartmentedepartmentid: grade.edepartmentedepartmentid
        }));

    return UserPositionMapping.query()
    .insertToTable(users, loggedInUser.sub)

}

gradeService.getUsersByPositionId = async (page, size, positionId) => {

    const grade = Grade.query().findById(positionId)

    if (!grade) return ServiceHelper.toEmptyPage(page, size)

    const userPage = await Grade.relatedQuery('users')
        .for(positionId)
        .modify('baseAttributes')
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, userPage)

}

gradeService.getAllGradesByUserIdAndCompanyId = async (companyId, userId) => {
    return Grade.query()
        .joinRelated('users')
        .joinRelated('company')
        .where('users.euserid', userId)
        .where('company.ecompanyid', companyId)
}

module.exports = gradeService