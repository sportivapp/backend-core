const router = require('../router')
const rosterController = require('../../controllers/roster');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

// router.post( routes.roster.list, auth.authenticateToken, rosterController.createRoster );
router.get( routes.roster.list, auth.authenticateToken, rosterController.getAllRostersByTimesheetId);
router.get( routes.roster.rosterId, auth.authenticateToken, rosterController.viewRosterById)
router.put( routes.roster.rosterId, auth.authenticateToken, rosterController.updateRosterById)
router.delete( routes.roster.rosterId, auth.authenticateToken, rosterController.deleteRosterById);
// router.post( routes.roster.shift, auth.authenticateToken, rosterController.generateRosterShiftForDate);
router.put( routes.roster.members, auth.authenticateToken, rosterController.updateUsersOfRosters)
router.get( routes.roster.rosterMemberId, auth.authenticateToken, rosterController.getAllMemberById);

module.exports = router.expressRouter;