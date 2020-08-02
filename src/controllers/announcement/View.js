const ResponseHelper = require('../../helper/ResponseHelper')
const announcementService = require('../../services/announcementService');

module.exports = async (req, res, next) => {

    const { announcementId } = req.params;
    const user = req.user;

    try {

        const result = await announcementService.getAnnouncementById(announcementId, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e);
    }
}