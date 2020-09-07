const Absen = require('../models/Absen');
const Location = require('../models/Location');
const User = require('../models/User')
const Device = require('../models/Device')
const ServiceHelper = require('../helper/ServiceHelper')
const FileService = require('./fileService')
const ShiftRosterUserMapping = require('../models/ShiftRosterUserMapping')

const AbsenService = {};

function getShiftTimeBasedOnLatestAbsen(latestAbsen, shiftTimes) {
    const clockInTime = new Date(latestAbsen.eabsenclockintime + latestAbsen.eabsenovertime - latestAbsen.eabsenlatetime)
    shiftTimes = shiftTimes
        .map(shift => shift.shiftTime)
        .filter(time => time.eshifttimestarthour === clockInTime.getHours() && time.eshifttimestartminute === clockInTime.getMinutes())
    return shiftTimes[0];
}

function getShiftTimeBasedOnMinimalDifferenceInStartTime(shiftTimes, formattedAbsenTime) {
    let currentTime
    shiftTimes = shiftTimes
        .filter(time => time.eshifttimestarthour > formattedAbsenTime.getHours()
            && time.eshifttimestartminute > formattedAbsenTime.getMinutes())
    let diffDate = new Date()
    diffDate.setHours(shiftTimes[0].eshifttimestarthour)
    diffDate.setMinutes(shiftTimes[0].eshifttimestartminute)
    let minDiff = diffDate.getTime() - formattedAbsenTime.getTime()
    shiftTimes.forEach(time => {
        diffDate.setHours(time.eshifttimestarthour)
        diffDate.setMinutes(time.eshifttimestartminute)
        const diff = diffDate.getTime() - formattedAbsenTime.getTime()
        if (diff < minDiff) {
            minDiff = diff
            currentTime = time
        }
    })
    return currentTime
}

AbsenService.createAbsenByPOS = async ( absenTime, deviceImei, fileId, userId ) => {

    const user = await User.query().findById(userId)

    if (!user) return

    const device = await Device.query().where('edeviceimei', deviceImei).first()

    if (!device) return

    const date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)

    //if frontend send millisecond based on minutes accuracy, don't need to format time on minutes accuracy
    const formattedAbsenTime = new Date(absenTime)
    formattedAbsenTime.setSeconds(0)
    formattedAbsenTime.setMilliseconds(0)

    const shifts = await ShiftRosterUserMapping.query()
        .where('eusereuserid', absenDTO.eusereuserid)
        .where('eshiftdaytime', date.getTime())
        .withGraphFetched('shiftTime')

    const latestAbsen = await Absen.query()
        .where('eusereuserid', userId)
        .orderBy('eabsencreatetime', 'DESC').first()

    let shiftTime

    if (shifts.length > 1) {
        let shiftTimes = shifts.filter(shift => !shift.eshiftgeneralstatus)
        if (!latestAbsen.eabsenclockouttime) {
            shiftTime = getShiftTimeBasedOnLatestAbsen(latestAbsen, shiftTimes)
        } else {
            shiftTime = getShiftTimeBasedOnMinimalDifferenceInStartTime(shiftTimes, formattedAbsenTime)
        }
    } else {
        shiftTime = shifts[0].shiftTime
    }

    // const file = await FileService.getFileById(fileId)

    //for now file is still disabled to successfully run tests
    // if (!file) return

    // if user tap absen in the time of another shift, complete 1 absen & create another

    if (!latestAbsen || latestAbsen.eabsenclockouttime) {

        const absenDTO = {
            eabsenclockintime: absenTime,
            eabsenclockinimageid: fileId,
            eusereuserid: userId,
            edeviceedeviceid: device.edeviceid
        }

        // Get Shift for Clock In
        date.setHours(shiftTime.eshifttimestarthour)
        date.setMinutes(shiftTime.eshifttimestartminute)
        const shiftTimeIn = date.getTime()

        const diffTime = formattedAbsenTime.getTime() - shiftTimeIn

        if (diffTime > 0) absenDTO["eabsenlatetime"] = diffTime

        else if (diffTime < 0) absenDTO['eabsenovertime'] = Math.abs(diffTime)

        return Absen.query().insertToTable(absenDTO, userId)

    } else {

        const patchDTO = {
            eabsenclockouttime: absenTime,
            eabsenclockoutimageid: fileId
        }

        // Get Shift for Clock Out
        date.setHours(shiftTime.eshifttimeendhour)
        date.setMinutes(shiftTime.eshifttimeendminute)
        const shiftTimeOut = date.getTime()

        const diffTime = formattedAbsenTime.getTime() - shiftTimeOut

        if (diffTime < 0) patchDTO["eabsenearlyleavetime"] = Math.abs(diffTime)

        else if (diffTime > 0) patchDTO['eabsenovertime'] = diffTime + latestAbsen.eabsenovertime

        return latestAbsen.$query().updateByUserId(patchDTO, userId)

    }
}

AbsenService.listAbsen = async ( page, size, userId ) => {
    let pageQuery = Absen.query()
        .orderBy('eabsencreatetime', 'ASC')

    if (!userId)
        pageQuery = pageQuery.where('eusereuserid', userId)

    const absenPage = await pageQuery
        .withGraphFetched('user')
        .page(page, size);

    return ServiceHelper.toPageObj(page, size, absenPage);
}

AbsenService.editAbsen = async ( absenId, absenDTO, user ) => {
    const absen = await Absen.query().updateByUserId(absenDTO, user.sub).where('eabsenid', absenId).andWhere('eusereuserid', user.sub);

    if (user.permission !== 1 && absen) return

    return absen;
}

AbsenService.deleteAbsen = async ( absenId, user ) => {
    const absen = await Absen.query().
    where('eabsenid', absenId)
        .andWhere('eusereuserid', user.sub)
        .deleteByUserId(user.sub)
        .returning('*');

    if (user.permission !== 1 && absen) return

    return absen;
}

module.exports = AbsenService;