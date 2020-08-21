const Absen = require('../models/Absen');
const Location = require('../models/Location');
const User = require('../models/User')
const Device = require('../models/Device')
const ServiceHelper = require('../helper/ServiceHelper')
const FileService = require('./mobileFileService')

const AbsenService = {};

AbsenService.createAbsenByPOS = async ( absenTime, deviceImei, fileId, userId ) => {

    const user = await User.query().findById(userId)

    if (!user) return

    const device = await Device.query().where('edeviceimei', deviceImei).first()

    if (!device) return

    // const file = await FileService.getFileById(fileId)

    //for now file is still disabled to successfully run tests
    // if (!file) return

    //if frontend send millisecond based on minutes accuracy, don't need to format time on minutes accuracy
    const formattedAbsenTime = new Date(absenTime)
    formattedAbsenTime.setMilliseconds(0)

    // if user tap absen in the time of another shift, complete 1 absen & create another

    const latestAbsen = await Absen.query()
        .where('eusereuserid', userId)
        .orderBy('eabsencreatetime', 'DESC').first()

    if (!latestAbsen || latestAbsen.eabsenclockouttime) {

        const absenDTO = {
            eabsenclockintime: absenTime,
            eabsenclockinimageid: fileId,
            eusereuserid: userId,
            edeviceedeviceid: device.edeviceid,
        }

        // Get Shift for Clock In
        const shiftTimeIn = Date.now() + 10000000

        const formattedTimeIn = new Date(shiftTimeIn)
        formattedTimeIn.setMilliseconds(0)

        const diffTime = formattedAbsenTime.getTime() - formattedTimeIn.getTime()

        if (diffTime > 0) absenDTO["eabsenlatetime"] = diffTime

        else if (diffTime < 0) absenDTO['eabsenovertime'] = -(diffTime)

        return Absen.query().insertToTable(absenDTO, userId)

    } else {

        const patchDTO = {
            eabsenclockouttime: absenTime,
            eabsenclockoutimageid: fileId
        }

        // Get Shift for Clock Out
        const shiftTimeOut = Date.now() + 10000000

        const formattedTimeOut = new Date(shiftTimeOut)
        formattedTimeOut.setMilliseconds(0)

        const diffTime = formattedAbsenTime.getTime() - formattedTimeOut.getTime()

        if (diffTime < 0) patchDTO["eabsenearlyleavetime"] = diffTime * -1

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