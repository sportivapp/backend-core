const express = require('express');
const router = express.Router();
const controller = require('../../controllers/mobileCompany')
const auth = require('../../middlewares/authentication');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOADS_DIRECTORY);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage })
const { routes } = require('../../constant')

router.get('/company/:companyId', auth.authenticateToken, controller.getCompany);
router.get( routes.company.pending, auth.authenticateToken, controller.getListPendingInviteByUserId);
router.get('/company', auth.authenticateToken, controller.getCompanies);
router.get('/virtual-member-company/:companyId', auth.authenticateToken, controller.getVirtualMemberCard);
router.post('/company-join', auth.authenticateToken, controller.joinCompany);
router.post( routes.company.upload, auth.authenticateToken, upload.single('file'), controller.uploadFile);
router.post( routes.company.exit, auth.authenticateToken, controller.exitCompany);
router.post( routes.company.processInvitation, auth.authenticateToken, controller.processInvitation);
router.delete( routes.company.cancelJoin, auth.authenticateToken, controller.userCancelJoin);
// user request join

module.exports = router;