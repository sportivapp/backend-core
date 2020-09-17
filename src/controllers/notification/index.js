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

controller.deleteNotificationBody = async (req, res, next) => {
    
    try {

        const result = await notificationService.deleteNotificationBody();

        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

module.exports = controller;