const Department = require('../models/Department')
const Company = require('../models/Company')
const Grade = require('../models/Grades')
const ServiceHelper = require('../helper/ServiceHelper')

const departmentService = {}

departmentService.getAllDepartmentbyCompanyId = async (page, size, companyId) => {

    if(companyId) {
        const result = await departmentService.getCompanyByCompanyId(companyId)

        if( !result ) return
    }

    const departmentPage = await Department.query().select().where('ecompanyecompanyid', companyId).page(page, size)

    return ServiceHelper.toPageObj(page, size, departmentPage)
}

departmentService.getCompanyByCompanyId = async (companyId) => {
    return Company.query().select().where('ecompanyid', companyId).first()
}

departmentService.createDepartment = async (departmentDTO, user) => {

    const result = await Department.query().insertToTable(departmentDTO, user.sub)

    const headDepartmentDTO = {
        egradename: 'Head of '  + departmentDTO.edepartmentname,
        egradedescription: 'The Head of ' + departmentDTO.edepartmentname,
        ecompanyecompanyid: departmentDTO.ecompanyecompanyid,
        edepartmentedepartmentid: result.edepartmentid
    }

    const newHead = await Grade.query().insertToTable(headDepartmentDTO, user.sub)

    return { result, newHead }
}

departmentService.updateDepartment = async (departmentId, departmentDTO, user) => {

    const result = await Department.query().findById(departmentId).updateByUserId(departmentDTO, user.sub).returning('*')

    return result
}

departmentService.deleteDepartment = async (departmentId) => {

    return Department.query()
    .where('edepartmentid', departmentId)
    .delete()
    .then(rowsAffected => rowsAffected === 1)
}

departmentService.getAllUsersWithinDepartment = async (page, size, departmentId) => {

    if (!departmentId) return ServiceHelper.toEmptyPage(page, size)

    const dataPage = await Grade.query()
        .where('edepartmentedepartmentid', departmentId)
        .withGraphJoined('[department, users]')
        .page(page, size)

    let users = []
    let total = 0

    dataPage.results.some((data, index) => {
        total += data.users.length
        const position = {
            egradeid: data.egradeid,
            egradename: data.egradename
        }
        const slicedUsers = page > 0 ? data.users.slice((page + 1) * size, (page + 2) * size) : data.users.slice(0, size)
        slicedUsers.some((user, index) => {
            if (users.length === size) return true
            users.push({ ...user, position: position })
        })
        if (users.length === size) return true
    })

    const pageObj = {
        results: users,
        page: page,
        size: size,
        total: total
    }

    return ServiceHelper.toPageObj(page, size, pageObj)

}

module.exports = departmentService
