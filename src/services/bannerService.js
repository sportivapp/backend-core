const Banner = require('../models/Banner');
const BannerStatusEnum = require('../models/enum/BannerStatusEnum');

bannerService = {};

bannerService.insertBanner = async (bannerDTO, user) => {

    return Banner.query()
        .insertToTable(bannerDTO, user.sub);

}

bannerService.getBanners = async () => {

    return Banner.query()
        .where('ebannerstatus', BannerStatusEnum.ACTIVE);

}

module.exports = bannerService;