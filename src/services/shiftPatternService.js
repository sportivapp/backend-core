const Shift = require('../models/Shift')
const ShiftTime = require('../models/ShiftTime')
const ShiftPattern = require('../models/ShiftPattern')
const ShiftRosterUserMapping = require('../models/ShiftRosterUserMapping')
const service = {}

service.createPattern = async (shiftId, patternDTO, user) => {

    const shift = await Shift.query().findById(shiftId)

    if (!shift) return

    const dto = {
        eshifteshiftid: shiftId,
        eshiftpatternstarttime: patternDTO.startTime,
        eshiftpatternendtime: patternDTO.endTime
    }

    return ShiftPattern.query()
        .insertToTable(dto, user.sub)
        .then(result => {
            const times = patternDTO.times.map(time => ({
                eshifttimename: time.name,
                eshifttimestarthour: time.startHour,
                eshifttimestartminute: time.startMinute,
                eshifttimeendhour: time.endHour,
                eshifttimeendminute: time.endMinute,
                eshifteshiftid: shiftId,
                eshiftpatterneshiftpatternid: result.eshiftpatternid
            }))
            return ShiftTime.query().insertToTable(times, user.sub)
                .then(insertedTimes => ({ ...result, times: insertedTimes }))
        })
}

service.getPatternById = async (patternId) => {
    return ShiftPattern.query().findById(patternId)
        .withGraphFetched('times')
}

service.getPatternsByShiftId = async (shiftId) => {
    return ShiftPattern.query()
        .where('eshifteshiftid', shiftId)
        .modify('baseAttributes')
        .withGraphFetched('times(baseAttributes)')
}

service.updatePatternById = async (shiftId, patternId, patternDTO, user) => {

    const pattern = await ShiftPattern.query().findById(patternId).withGraphFetched('[times, shift.timesheets]')

    if (!pattern || pattern.shift.timesheets.length > 0) return

    const promises = []

    const patchDTO = {
        eshiftpatternstarttime: patternDTO.startTime,
        eshiftpatternendtime: patternDTO.endTime
    }

    const updatePattern = pattern.$query()
        .updateByUserId(patchDTO, user.sub).returning('*')

    promises.push(updatePattern)

    const deletedShiftTimeIds = patternDTO.times.filter(time => time.deleted).map(time => time.id)

    const deleteTimes = ShiftTime.query()
        .whereIn('eshifttimeid', deletedShiftTimeIds)
        .where('eshiftpatterneshiftpatternid', patternId)
        .delete()
        .then(ignored => ShiftRosterUserMapping.query()
            .whereIn('eshifttimeeshifttimeid', deletedShiftTimeIds)
            .delete())

    promises.push(deleteTimes)

    const updateTime = (id, patchDTO) => ShiftTime.query()
        .findById(id)
        .updateByUserId(patchDTO, user.sub)
        .returning('*')

    const insertTime = (timeDTO) => ShiftTime.query()
        .insertToTable(timeDTO, user.sub)

    patternDTO.times.filter(time => !time.deleted)
        .forEach(time => {
            const patchDTO = {
                eshifttimename: time.name,
                eshifttimestarthour: time.startHour,
                eshifttimestartminute: time.startMinute,
                eshifttimeendhour: time.endHour,
                eshifttimeendminute: time.endMinute,
                eshifteshiftid: parseInt(shiftId),
                eshiftpatterneshiftpatternid: parseInt(patternId)
            }
            if (time.id) promises.push(updateTime(time.id, patchDTO))
            else promises.push(insertTime(patchDTO))
        })

    return Promise.all(promises)
        .then(resultArr => ({ ...resultArr[0], times: resultArr.slice(2, resultArr.length) }))
}

service.deletePatternById = async (patternId) => {
    return ShiftPattern.query().findById(patternId)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = service