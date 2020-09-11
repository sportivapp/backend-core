const MobileAppVersion = require('../models/MobileAppVersion')

const mobileAppVersionService = {}

mobileAppVersionService.getVersion = () => {

    return MobileAppVersion.query()
    .select()
    .orderBy('emobileappversionchangetime', 'DESC')
    .first()

}

module.exports = mobileAppVersionService