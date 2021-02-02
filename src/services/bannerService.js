const Banner = require('../models/Banner');
const BannerStatusEnum = require('../models/enum/BannerStatusEnum');
const BannerTypeEnum = require('../models/enum/BannerTypeEnum');
const { UnsupportedOperationError } = require('../models/errors');
const fileService = require('./fileService');

const ErrorEnum = {
    INVALID_FILE_OWNER: 'INVALID_FILE_OWNER',
    TYPE_ERROR: 'TYPE_ERROR',
}

bannerService = {};

bannerService.insertBanner = async (bannerDTO, user) => {

    await fileService.getFileByIdAndCreateBy(bannerDTO.efileefileid, user.sub)
        .then(file => {
            if (!file)
                throw new UnsupportedOperationError(ErrorEnum.INVALID_FILE_OWNER);
        });

    return Banner.query()
        .insertToTable(bannerDTO, user.sub);

}

bannerService.getBanners = async (type) => {

    const typeInEnum = BannerTypeEnum[type];

    if (!typeInEnum)
        throw new UnsupportedOperationError(ErrorEnum.TYPE_ERROR);

    return Banner.query()
        .modify('baseAttributes')
        .where('ebannerstatus', BannerStatusEnum.ACTIVE)
        .where('ebannertype', typeInEnum)
        .orderBy('ebannercreatetime', 'DESC');

}

module.exports = bannerService;