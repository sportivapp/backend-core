const announcementService = require('../../services/announcementService');

module.exports = async (req, res, next) => {

    try {

        const { announcementTitle, announcementContent } = req.body;
        const user = req.user;

        if (user.permission !== 7) {
            return res.status(401).json({
                data: 'You cannot create announcement'
            })
        }

        const announcementDTO = {
            eannouncementtitle: announcementTitle,
            eannouncementcontent: announcementContent,
            eannouncementcreateby: user.sub,
            eusereuserid: user.sub
        }

        const announcement = await announcementService.createAnnouncement(announcementDTO);

        return res.status(200).json({
            data: announcement
        });
        
    } catch (e) {
        next(e);
    }
}