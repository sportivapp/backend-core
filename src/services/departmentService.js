const Department = require('../models/Department')
const Company = require('../models/Company')
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

departmentService.createDepartment = async (departmentDTO) => {

    const result = await Department.query().insert(departmentDTO)

    return result
}

departmentService.updateDepartment = async (departmentId, departmentDTO) => {

    const result = await Department.query().patchAndFetchById(departmentId, departmentDTO)

    return result
}

departmentService.deleteDepartment = async (departmentId) => {

    return Department.query()
    .where('edepartmentid', departmentId)
    .delete()
    .then(rowsAffected => rowsAffected === 1)
}

module.exports = departmentService
