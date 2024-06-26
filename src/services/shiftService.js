const Shift = require('../models/Shift')

const shiftService = {}

shiftService.createShift = async (shiftDTO, user) => {
    return Shift.query().insertToTable(shiftDTO, user.sub)
}

shiftService.getAllShift = async () => {
    return Shift.query().modify('baseAttributes')
}

shiftService.getShiftById = async (shiftId) => {
    return Shift.query()
        .findById(shiftId)
        .modify('baseAttributes')
        .withGraphFetched('patterns(baseAttributes)')
}

shiftService.updateShiftById = async (shiftId, shiftDTO, user) => {
    const shift = await Shift.query().findById(shiftId).withGraphFetched('timesheets')

    if (shift.timesheets.length > 0) return

    return shift.$query()
        .updateByUserId(shiftDTO, user.sub)
        .returning('*')
}

shiftService.deleteShiftById = async (shiftId) => {
    return Shift.query()
        .findById(shiftId)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = shiftService