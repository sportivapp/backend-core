const ModuleNameEnum = require('../models/enum/ModuleNameEnum')
const settingService = require('./settingService')
const gradeService = require('./gradeService')
const companyService = require('./companyService')

const tournamentService = {}

function filterDuplicateCompanies(companies) {
    let newCompanies = []
    companies.forEach(company => {
        if (!newCompanies.find(filteredCompany => filteredCompany.ecompanyid === company.ecompanyid))
            newCompanies.push(company)
    })
    return newCompanies
}

async function findCompaniesByGradeAndModule(grade, tournamentModule) {
    const tournamentFunctions = await settingService.getAllFunctionByGradeIdAndModuleId(grade.egradeid, tournamentModule.emoduleid)
    let haveCreatePermission = !!tournamentFunctions.find(func => 'C' + tournamentModule.emoduleid === func.code)
    return haveCreatePermission ? companyService.getCompanyById(grade.ecompanyecompanyid) : new Promise(() => null)
}

tournamentService.getAllCompaniesByCreatePermission = async (user) => {
    const grades = await gradeService.getAllGradesByUserId(user.sub)
    const tournamentModule = await settingService.getModuleByName(ModuleNameEnum.TOURNAMENT)
    let findCompanies = grades.map(grade => findCompaniesByGradeAndModule(grade, tournamentModule))
    return Promise.all(findCompanies)
        .then(companies => companies.filter(company => !!company))
        .then(companies => filterDuplicateCompanies(companies))
}

module.exports = tournamentService