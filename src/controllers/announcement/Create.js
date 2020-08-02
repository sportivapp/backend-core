const ResponseHelper = require('../../helper/ResponseHelper')
const announcementService = require('../../services/announcementService');

module.exports = async (req, res, next) => {
    
    const { announcementTitle, announcementContent, userIds } = req.body;
    const user = req.user;

    try {

        const announcementDTO = {
            eannouncementtitle: announcementTitle,
            eannouncementcontent: announcementContent,
            eannouncementcreateby: user.sub
        }

        const result = await announcementService.createAnnouncement(announcementDTO, userIds, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e);
    }
}