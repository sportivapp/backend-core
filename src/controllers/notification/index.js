const notificationService = require('../../services/notificationService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getAllNotification = async (req, res, next) => {

    const {page = '0', size = '100' } = req.query
    
    try {

        const pageObj = await notificationService.getAllNotification(parseInt(page), parseInt(size), req.user);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }

}

controller.getAllNotificationBody = async (req, res, next) => {

    const {page = '0', size = '100', type = 'ALL' } = req.query
    
    try {

        const pageObj = await notificationService.getAllNotificationBody(parseInt(page), parseInt(size), req.user, type.toUpperCase());

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }

}

controller.deleteNotification = async (req, res, next) => {

    const { notificationId } = req.params
    
    try {

        const result = await notificationService.deleteNotification(notificationId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

module.exports = controller;