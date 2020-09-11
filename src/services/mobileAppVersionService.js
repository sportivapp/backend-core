const MobileAppVersion = require('../models/MobileAppVersion')

const mobileAppVersionService = {}

mobileAppVersionService.getVersion = () => {

    return MobileAppVersion.query()
    .select()
    .first()

}

module.exports = mobileAppVersionService