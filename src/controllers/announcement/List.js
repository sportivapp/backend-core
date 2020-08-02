const ResponseHelper = require('../../helper/ResponseHelper')
const announcementService = require('../../services/announcementService');

module.exports = async (req, res, next) => {

    const { page, size } = req.query
    const user = req.user;

    try {
        const pageObj = await announcementService.getAllAnnouncement(parseInt(page), parseInt(size), user);

        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e);
    }
}