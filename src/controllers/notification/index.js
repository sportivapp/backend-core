const notificationService = require('../../services/notificationService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getNotificationCount = async (req, res, next) => {

    try {

        const result = await notificationService.getNotificationCount(req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.clickNotification = async (req, res, next) => {

    const { notificationId } = req.params;

    try {

        const result = await notificationService.clickNotification(notificationId, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getAllNotification = async (req, res, next) => {

    const {page = '0', size = '100' } = req.query
    
    try {

        const pageObj = await notificationService.getAllNotification(parseInt(page), parseInt(size), req.user);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }

}

controller.deleteNotificationBody = async (req, res, next) => {
    
    try {

        const result = await notificationService.deleteNotificationBody();

        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

controller.createNotification = async (req, res, next) => {

    const { entityId, entityType, action, title, message, user, targetUserIds } = req.body;

    const notificationDTO = {
        enotificationbodyentityid: entityId,
        enotificationbodyentitytype: entityType,
        enotificationbodyaction: action,
        enotificationbodytitle: title,
        enotificationbodymessage: message,
        enotificationbodysenderid: user.sub
    };

    try {

        const result = await notificationService.createNotification(notificationDTO, user, targetUserIds);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;