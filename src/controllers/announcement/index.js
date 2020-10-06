const ResponseHelper = require('../../helper/ResponseHelper')
const announcementService = require('../../services/announcementService');

announcementController = {}

announcementController.publishAnnouncement = async (req, res, next) => {

    if (req.user.functions.indexOf('C11') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))
    
    const {userIds } = req.body;
    const user = req.user;

    const { announcementId } = req.params 

    try {

        const result = await announcementService.publishAnnouncement(announcementId,userIds,user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e);
    }
}

announcementController.deleteAnnouncement = async (req, res, next) => {

    if (req.user.functions.indexOf('D11') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    
    const user = req.user;
    const { announcementId } = req.params;

    try {

        const result = await announcementService.deleteAnnouncement(announcementId, user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

announcementController.getAllAnnouncement = async (req, res, next) => {

    const { page, size, type } = req.query
    const user = req.user;

    try {

        const pageObj = await announcementService.getAllAnnouncement(parseInt(page), parseInt(size), type, user);
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
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e);
    }
}

announcementController.updateAnnouncement = async (req, res, next) => {

    if (req.user.functions.indexOf('U11') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))
   
    const user = req.user;
    const { announcementId } = req.params;
    const { announcementTitle, announcementContent, userIds } = req.body;

    try {

        const announcementDTO = {
            eannouncementtitle: announcementTitle,
            eannouncementcontent: announcementContent
        }

        const result = await announcementService.updateAnnouncement(announcementId, announcementDTO, userIds, user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

announcementController.createAnnouncement = async (req,res,next) => {

    if (req.user.functions.indexOf('C11') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { announcementTitle, announcementContent, fileId} = req.body;
    const user = req.user;
    
    try{
        
        const announcementDTO = {
            eannouncementtitle: announcementTitle,
            eannouncementcontent: announcementContent,
            efileefileid: fileId,
            ecompanyecompanyid: user.companyId

        }

        const result = await announcementService.createAnnouncement(announcementDTO,user)
        return res.status(200).json(ResponseHelper.toPageResponse(result))

    } catch(e) {
        next(e)
    }
    
}

module.exports = announcementController;