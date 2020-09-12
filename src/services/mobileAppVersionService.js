const MobileAppVersion = require('../models/MobileAppVersion')

const mobileAppVersionService = {}

mobileAppVersionService.getVersion = async (version) => {

    const currentMobileVersion = await MobileAppVersion.query()
        .where('emobileappversion', version)
        .first();

    const versions = await MobileAppVersion.query()
    .where('emobileappversionchangetime', '>', currentMobileVersion.emobileappversionchangetime)

    let isForceUpdate = false;
    let isRecommendUpdate = false;

    for (let i=0;i<versions.length;i++) {

        // If any of the version greater than current version forces update
        if (versions[i].emobileappversionforceupdate === true) {
            isForceUpdate = true;
            break;
        }

    }

    // If there is a new version
    if (versions.length !== 0)
        isRecommendUpdate = true;

    return {
        version: versions[versions.length - 1],
        isForceUpdate: isForceUpdate,
        isRecommendUpdate: isRecommendUpdate
    }

}

module.exports = mobileAppVersionService