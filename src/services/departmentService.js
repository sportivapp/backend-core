const Department = require('../models/Department')
const Company = require('../models/Company')
const Grade = require('../models/Grades')
const User = require('../models/User')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const ServiceHelper = require('../helper/ServiceHelper')

const departmentService = {}

departmentService.getAllDepartmentbyCompanyId = async (page, size, type, companyId, superiorId) => {

    if(companyId) {
        const result = await departmentService.getCompanyByCompanyId(companyId)

        if( !result ) return
    }

    let departmentPage

    if( type === 'SUPERIOR') {

        departmentPage = await Department.query()
        .select()
        .where('ecompanyecompanyid', companyId)
        .where('edepartmentsuperiorid', null)
        .page(page, size)

    } else if( type === 'SUB') {

        if(!superiorId)
            return ServiceHelper.toEmptyPage(page, size)
            
        departmentPage = await Department.query()
        .select()
        .where('ecompanyecompanyid', companyId)
        .where('edepartmentsuperiorid', superiorId)
        .page(page, size)

    } else {

        departmentPage = await Department.query().select().where('ecompanyecompanyid', companyId).page(page, size)

    }

    return ServiceHelper.toPageObj(page, size, departmentPage)
}

departmentService.getDepartmentByDepartmentId = async (departmentId) => {

    const department = await Department.query()
    .select()
    .where('edepartmentid', departmentId)
    .first()

    if(!department)
        return

    const subDepartment = await Department.query()
    .where('edepartmentsuperiorid', departmentId)
    .count()

    const company = await Company.query()
    .select()
    .where('ecompanyid', department.ecompanyecompanyid)
    .first()

    const companyUser = await CompanyUserMapping.query()
    .select('eusereuserid')
    .where('ecompanyecompanyid', company.ecompanyid)
    .where('ecompanyusermappingpermission', 10)
    .first()

    const user = await User.query()
    .select('eusername','euserid')
    .where('euserid', companyUser.eusereuserid)
    .first()

    const userData = await Grade.relatedQuery('users')
        .for(Grade.query().where('edepartmentedepartmentid', departmentId))

    const data = {
        edepartmentid: department.edepartmentid,
        edepartmentname: department.edepartmentname,
        edepartmentdescription: department.edepartmentdescription,
        edepartmentsuperiorid: department.edepartmentsuperiorid,
        ecompanyecompanyid: department.ecompanyecompanyid,
        childrenCount: parseInt(subDepartment[0].count),
        ecompanyname: company.ecompanyname,
        eusername: user.eusername,
        userCount: userData.length
    }

    return data

}


departmentService.getCompanyByCompanyId = async (companyId) => {
    return Company.query().select().where('ecompanyid', companyId).first()
}

departmentService.createDepartment = async (departmentDTO, user) => {

    const result = await Department.query().insertToTable(departmentDTO, user.sub)

    const headDepartmentDTO = {
        egradename: 'Head of '  + departmentDTO.edepartmentname,
        egradedescription: 'The Head of ' + departmentDTO.edepartmentdescription,
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
