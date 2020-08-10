const CompanyUserMapping = require('../models/CompanyUserMapping')

exports.getPermission = async (req, res, next) => {

    let user = req.user

    let { companyId } = req.body

    if (!companyId) {
        companyId = req.params.companyId
    }

    if (!companyId) {
        companyId = req.query.companyId
    }

    if (companyId) {
        const permission = await CompanyUserMapping.query()
            .where('ecompanyecompanyid', companyId)
            .where('eusereuserid', user.sub)
            .first()
            .then(mapping => mapping.ecompanyusermappingpermission)

        user['permission'] = permission
        user['companyId'] = companyId
    } else {
        user['permission'] = 0
    }

    req.user = user

    next()

}