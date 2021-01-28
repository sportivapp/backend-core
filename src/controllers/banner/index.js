const bannerService = require('../../services/bannerService');
const ResponseHelper = require('../../helper/ResponseHelper');

bannerController  = {};

bannerController.insertBanner = async(req, res, next) => {

    const { fileId } = req.body;

    const bannerDTO = {
        efileefileid: fileId,
    }

    try {

        const result = await bannerService.insertBanner(bannerDTO, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e){
        next(e);
    }

}

bannerController.getBanners = async(req, res, next) => {

    try {

        const result = await bannerService.getBanners();
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e){
        next(e);
    }

}

module.exports = bannerController;