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

    const department = await Department.query().findById(gradeDTO.edepartmentedepartmentid)
    if (!department) return

    return Grade.query().insertToTable(gradeDTO, userId)
}

gradeService.updateGradeById = async (gradeId, gradeDTO) => {

    if (gradeDTO.egradesuperiorid) {
        const superior = await gradeService.getGradeById(gradeDTO.egradesuperiorid)
        if (!superior) return
    }

    if (gradeDTO.ecompanyecompanyid) {
        const company = await Company.query().findById(gradeDTO.ecompanyecompanyid)
        if (!company) return
    }
    const grade = await gradeService.getGradeById(gradeId)
    return grade.$query().patchAndFetch(gradeDTO)
}

gradeService.deleteGradeById = async (gradeId, user) => {

    const grade = await Grade.query().select().where('egradeid', gradeId).first()
    
    if(!grade)
        return false

    if( grade.egradesuperiorid !== null) {
        const superior = await Grade.query().select()
            .where('egradeid', grade.egradesuperiorid)
            .first()

        const subordinates = await Grade.relatedQuery('subordinates')
        .for(grade.egradeid)

        const gradeIds = subordinates
                .map(subordinate => subordinate.egradeid)
        if ( grade.egradesuperiorid !== null) {

            await Grade.query()
            .whereIn('egradeid', gradeIds)
            .updateByUserId({egradesuperiorid: superior.egradeid}, user.sub)

        } else {

            await Grade.query()
            .whereIn('egradeid', gradeIds)
            .updateByUserId({egradesuperiorid: null}, user.sub)

        }

    }

    return Grade.query()
        .delete()
        .where('egradeid', gradeId)
        .then(rowsAffected => rowsAffected === 1)
}

gradeService.saveUserPositions = async (userId, positionIds, user) => {

    await UserPositionMapping.query()
    .where('eusereuserid', userId).delete()

    const positions = positionIds.map(position => 
        ({ 
            eusereuserid: userId,
            egradeegradeid: position
        }));  

    return UserPositionMapping.query()
    .insertToTable(positions, user.sub)

}

gradeService.getUsersByPositionId = async (page, size, positionId) => {

    const grade = Grade.query().findById(positionId)

    if (!grade) return ServiceHelper.toEmptyPage(page, size)

    const userPage = await UserPositionMapping.relatedQuery('users')
        .for(UserPositionMapping.query().where('egradeegradeid', positionId))
        .page(page, size)

    console.log(userPage.results)

    return ServiceHelper.toPageObj(page, size, userPage)

}

module.exports = gradeService