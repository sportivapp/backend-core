const ResponseHelper = require('../../helper/ResponseHelper')
const announcementService = require('../../services/announcementService');

announcementController = {}

announcementController.createAnnouncement = async (req, res, next) => {
    
    const { announcementTitle, announcementContent, userIds } = req.body;
    const user = req.user;

    try {

        const announcementDTO = {
            eannouncementtitle: announcementTitle,
            eannouncementcontent: announcementContent,
            eannouncementcreateby: user.sub,
            ecompanyecompanyid: user.companyId
        }

        const result = await announcementService.createAnnouncement(announcementDTO, userIds, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e);
    }
}

announcementController.deleteAnnouncement = async (req, res, next) => {

    
    const user = req.user;
    const { announcementId } = req.params;

    try {

        const result = await announcementService.deleteAnnouncement(announcementId, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

announcementController.getAllAnnouncement = async (req, res, next) => {

    const { page, size } = req.query
    const user = req.user;

    try {
        const pageObj = await announcementService.getAllAnnouncement(parseInt(page), parseInt(size), user);

        if(!pageObj)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))

        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e);
    }
}

announcementController.getAnnouncementById = async (req, res, next) => {

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

announcementController.updateAnnouncement = async (req, res, next) => {
   
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

module.exports = announcementController;