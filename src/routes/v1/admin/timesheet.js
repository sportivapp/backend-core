const router = require('../../router')
const timesheetService = require('../../../controllers/timesheet');
const auth = require('../../../middlewares/authentication');
const { routes } = require('../../../constant')

router.post( routes.timesheet.list, auth.authenticateToken, timesheetService.createTimesheet);
router.get( routes.timesheet.list, auth.authenticateToken, timesheetService.getTimesheets);
router.get( routes.timesheet.id, auth.authenticateToken, timesheetService.getTimesheetById);
router.put( routes.timesheet.id, auth.authenticateToken, timesheetService.updateTimesheetById)
router.delete( routes.timesheet.id, auth.authenticateToken, timesheetService.deleteTimesheetById);

module.exports = router.expressRouter;