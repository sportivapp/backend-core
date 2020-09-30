const Grade = require('../models/Grades')
const Department = require('../models/Department')
const Company = require('../models/Company')
const UserPositionMapping = require('../models/UserPositionMapping')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')

const gradeService = {}

const ErrorEnum = {
    SUPERIOR_NOT_FOUND: 'SUPERIOR_NOT_FOUND',
    COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
    DEPARTMENT_NOT_FOUND: 'DEPARTMENT_NOT_FOUND',
    POSITION_NOT_FOUND: 'POSITION_NOT_FOUND'
}

gradeService.getAllGrades = async (page, size, companyId, departmentId) => {

    if (departmentId) {

        if (!departmentId) return ServiceHelper.toEmptyPage(page, size)

        const gradePage = await Grade.query()
            .where('edepartmentedepartmentid', departmentId)
            .withGraphFetched('[superior,department.parent.parent,company.parent.parent]')
            .page(page, size)
        return ServiceHelper.toPageObj(page, size, gradePage)

    } else {

        if (!companyId) return ServiceHelper.toEmptyPage(page, size)

        const branchIds = await Company.relatedQuery('branches')
            .for(companyId)
            .withGraphFetched('branches')
            .then(companies => {
                if (companies.length > 0) {
                    let ids = []
                    ids.push(companyId)
                    companies.forEach(company => {
                        ids.push(company.ecompanyid)
                        company.branches.forEach(branch => ids.push(branch.ecompanyid))
                    })
                    return ids
                }
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
        .then(position => {
            if (!position) throw new NotFoundError()
            return position
        })
}

gradeService.createGrade = async (gradeDTO, userId) => {

    if (gradeDTO.egradesuperiorid) {
        const superior = await gradeService.getGradeById(gradeDTO.egradesuperiorid)
        if (!superior) throw new UnsupportedOperationError(ErrorEnum.SUPERIOR_NOT_FOUND)
    }

    const company = await Company.query().findById(gradeDTO.ecompanyecompanyid)
    if (!company) throw new UnsupportedOperationError(ErrorEnum.COMPANY_NOT_FOUND)

    if (gradeDTO.edepartmentedepartmentid) {
        const department = await Department.query().findById(gradeDTO.edepartmentedepartmentid)
        if (!department) throw new UnsupportedOperationError(ErrorEnum.DEPARTMENT_NOT_FOUND)
    }

    return Grade.query().insertToTable(gradeDTO, userId)
}

gradeService.updateGradeById = async (gradeId, gradeDTO, user) => {

    const grade = await gradeService.getGradeById(gradeId)
        .catch(() => new UnsupportedOperationError(ErrorEnum.POSITION_NOT_FOUND))

    if (gradeDTO.egradesuperiorid) {
        const superior = await gradeService.getGradeById(gradeDTO.egradesuperiorid)
        if (!superior) throw new UnsupportedOperationError(ErrorEnum.SUPERIOR_NOT_FOUND)
    }

    if (gradeDTO.ecompanyecompanyid) {
        const company = await Company.query().findById(gradeDTO.ecompanyecompanyid)
        if (!company) throw new UnsupportedOperationError(ErrorEnum.COMPANY_NOT_FOUND)
    }

    return Grade.transaction(async trx => {

        if (grade.edepartmentedepartmentid !== gradeDTO.edepartmentedepartmentid) {

            if (gradeDTO.edepartmentedepartmentid !== null) {

                const department = await Department.query().findById(gradeDTO.edepartmentedepartmentid)
                if (!department) throw new UnsupportedOperationError(ErrorEnum.DEPARTMENT_NOT_FOUND)
            }

            return UserPositionMapping.query(trx).where('egradeegradeid', grade.egradeid)
                .updateByUserId({ edepartmentedepartmentid: gradeDTO.edepartmentedepartmentid }, user.sub)
                .then(ignored => grade.$query(trx).updateByUserId(gradeDTO, user.sub).returning('*'))
        }

        return grade.$query(trx).updateByUserId(gradeDTO, user.sub).returning('*')

    })
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

    return Grade.transaction(async trx => {

    return Grade.query(trx)
        .whereIn('egradeid', gradeIds)
        .updateByUserId({ egradesuperiorid: superiorId }, user.sub)
        .then(ignored => grade.$query(trx).delete().then(rowsAffected => rowsAffected === 1))

    }).catch(() => {
        return false
    })
}

gradeService.saveUserPositions = async (userIds, positionId, loggedInUser) => {

    return UserPositionMapping.transaction(async trx => {

        await UserPositionMapping.query(trx)
        .where('egradeegradeid', positionId)
        .delete()

        const grade = await gradeService.getGradeById(positionId)
            .catch(() => new UnsupportedOperationError(ErrorEnum.POSITION_NOT_FOUND))

        const users = userIds.map(userId =>
            ({
                eusereuserid: parseInt(userId),
                egradeegradeid: positionId,
                edepartmentedepartmentid: grade.edepartmentedepartmentid
            }));

        return UserPositionMapping.query(trx)
        .insertToTable(users, loggedInUser.sub)

    })

}

gradeService.getUsersByPositionId = async (page, size, positionId) => {

    if (!positionId) return ServiceHelper.toEmptyPage(page, size)

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