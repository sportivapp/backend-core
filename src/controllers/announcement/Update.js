const announcementService = require('../../services/announcementService');
const { fn } = require('../../db/config');

module.exports = async (req, res, next) => {

    try {

        const user = req.user;

        if (user.permission !== 7) {
            return res.status(401).json({
                data: 'You cannot update announcement'
            })
        }

        const { announcementId } = req.params;
        const { announcementTitle, announcementContent } = req.body;

        const announcementDTO = {
            eannouncementtitle: announcementTitle,
            eannouncementcontent: announcementContent,
            eannouncementeditby: user.sub,
            eannouncementedittime: Date.now()
        }

        const isUpdated = await announcementService.updateAnnouncement(announcementId, announcementDTO);

        const data = {
            isDeleted: (isUpdated) ? true : false,
            message: (isUpdated) ? "Successfully update announcement!" : "Failed to update announcement!"
        }

        return res.status(200).json({
            data: data
        });

    } catch(e) {
        next(e);
    }

}