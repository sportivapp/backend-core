const Department = require('../models/Department')
const Grade = require('../models/Grades')
const User = require('../models/User')
const ServiceHelper = require('../helper/ServiceHelper')
const companyService = require('./companyService')
const { NotFoundError } = require('../models/errors')

const departmentService = {}


departmentService.getDepartementId = async(departementId) => {

    return Department.query().findById(departementId)
}


departmentService.getAllDepartmentbyCompanyId = async (page, size, type, companyId, superiorId) => {

    if (!companyId) return ServiceHelper.toEmptyPage(page, size)

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
    .findById(departmentId)

    if(!department) throw new NotFoundError()

    const subDepartment = await Department.query()
    .where('edepartmentsuperiorid', departmentId)
    .count()

    const company = await companyService.getCompanyById(department.ecompanyecompanyid)

    const headUser = await Grade.query().where('ecompanyecompanyid', company.ecompanyid)
        .orderBy('egradecreatetime', 'ASC')
        .first()
        .then(position => {
            if (!position) return
            return position
                .$relatedQuery('users')
                .select('eusername','euserid')
                .orderBy('eusercreatetime', 'ASC')
                .first()
        })

    const userData = await Grade.relatedQuery('users')
        .for(Grade.query().where('edepartmentedepartmentid', departmentId))

    return {
        edepartmentid: department.edepartmentid,
        edepartmentname: department.edepartmentname,
        edepartmentdescription: department.edepartmentdescription,
        edepartmentsuperiorid: department.edepartmentsuperiorid,
        ecompanyecompanyid: department.ecompanyecompanyid,
        childrenCount: parseInt(subDepartment[0].count),
        ecompanyname: company.ecompanyname,
        eusername: headUser ? headUser.eusername : null,
        userCount: userData.length
    }

}

departmentService.createDepartment = async (departmentDTO, user) => {

    return Department.transaction(async trx => {

        const result = await Department.query(trx).insertToTable(departmentDTO, user.sub)

        const headDepartmentDTO = {
            egradename: 'Head of '  + departmentDTO.edepartmentname,
            egradedescription: 'The Head of ' + departmentDTO.edepartmentdescription,
            ecompanyecompanyid: departmentDTO.ecompanyecompanyid,
            edepartmentedepartmentid: result.edepartmentid
        }

        return Grade.query(trx).insertToTable(headDepartmentDTO, user.sub)
            .then(newHead => ({ result, newHead }))

        })
}

departmentService.updateDepartment = async (departmentId, departmentDTO, user) => {

    return Department.query().findById(departmentId).updateByUserId(departmentDTO, user.sub).returning('*');
}

departmentService.deleteDepartment = async (departmentId) => {

    return Department.query()
    .findById(departmentId)
    .delete()
    .then(rowsAffected => rowsAffected === 1)
}

departmentService.getAllUsersWithinDepartment = async (page, size, departmentId) => {

    if (!departmentId) return ServiceHelper.toEmptyPage(page, size)

    return User.query()
        .select('euser.*', 'egradeid', 'egradename')
        .joinRelated('grades')
        .where('grades.edepartmentedepartmentid', departmentId)
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page ,size, pageObj))

}

module.exports = departmentService
