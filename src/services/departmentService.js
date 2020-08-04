const Department = require('../models/Department')
const ServiceHelper = require('../helper/ServiceHelper')

const departmentService = {}

departmentService.getAllDepartmentbyCompanyId = async (page, size, companyId) => {

    const departmentPage = await Department.query().select().where('ecompanyecompanyid', companyId).page(page, size)

    return ServiceHelper.toPageObj(page, size, departmentPage)
}

departmentService.createDepartment = async (departmentDTO) => {

    const result = await Department.query().insert(departmentDTO)

    return result
}

departmentService.updateDepartment = async (departmentId, departmentDTO) => {

    const result = await Department.query().patchAndFetchById(departmentId, departmentDTO)

    return result
}

departmentService.deleteDepartment = async (departmentId) => {

    const result = await Department.query().where('edepartmentid', departmentId).delete()

    return result
}

module.exports = departmentService
