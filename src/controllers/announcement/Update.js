const ResponseHelper = require('../../helper/ResponseHelper')
const announcementService = require('../../services/announcementService');
module.exports = async (req, res, next) => {
   
    const user = req.user;
    const { announcementId } = req.params;
    const { announcementTitle, announcementContent, userIds } = req.body;

    try {

        const announcementDTO = {
            eannouncementtitle: announcementTitle,
            eannouncementcontent: announcementContent
        }

        const result = await announcementService.updateAnnouncement(announcementId, announcementDTO, userIds, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}