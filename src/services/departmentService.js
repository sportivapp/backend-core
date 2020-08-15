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
        ecompanyecompanyid: departmentDTO.companyId,
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

module.exports = departmentService
