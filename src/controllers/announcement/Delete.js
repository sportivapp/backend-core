const announcementService = require('../../services/announcementService');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;

        if (user.permission !== 7) {
            return res.status(401).json({
                data: 'You cannot delete announcement'
            })
        }

        const { announcementId } = req.params;

        const isDeleted = await announcementService.deleteAnnouncement(announcementId, user.sub);

        const data = {
            isDeleted: (isDeleted) ? true : false,
            message: (isDeleted) ? "Successfully delete announcement!" : "Failed to delete announcement!"
        }

        return res.status(200).json({
            data: data
        });

    } catch(e) {
        next(e);
    }

}