const announcementService = require('../../services/mobileAnnouncementService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getAnnouncements = async (req, res, next) => {

    try {

        const result = await announcementService.getAnnouncements(req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getAnnouncement = async (req, res, next) => {

    const { announcementId } = req.params;

    try {

        const result = await announcementService.getAnnouncement(announcementId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;