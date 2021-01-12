const Banner = require('../models/Banner');
const BannerStatusEnum = require('../models/enum/BannerStatusEnum');
const { UnsupportedOperationError } = require('../models/errors');
const fileService = require('./fileService');

const ErrorEnum = {
    INVALID_FILE_OWNER: 'INVALID_FILE_OWNER',
}

bannerService = {};

bannerService.insertBanner = async (bannerDTO, user) => {

    await fileService.getFileByIdAndCreateBy(bannerDTO.efileefileid, user.sub)
        .then(file => {
            if (!file)
                throw UnsupportedOperationError(ErrorEnum.INVALID_FILE_OWNER);
        });

    return Banner.query()
        .insertToTable(bannerDTO, user.sub);

}

bannerService.getBanners = async () => {

    return Banner.query()
        .where('ebannerstatus', BannerStatusEnum.ACTIVE);

}

module.exports = bannerService;