const Absen = require('../models/Absen');

const AbsenService = {};

AbsenService.createAbsen = async ( absenDTO ) => {
    const absen = await Absen.query().insert(absenDTO);

    return absen;
}

AbsenService.listAbsenById = async ( userId ) => {
    const absen = await Absen.query().select().where('eusereuserid', userId).andWhere('eabsendeletestatus', 0).orderBy('eabsencreatetime', 'asc');

    return absen;
}

AbsenService.listAbsen = async () => {
    const absen = await Absen.query().select().where('eabsendeletestatus', 0).orderBy('eabsencreatetime');

    return absen;
}

AbsenService.editAbsen = async ( absenId, absenDTO ) => {
    const updatedAbsen = await Absen.query().where('eabsenid', absenId).update(absenDTO);

    return updatedAbsen;
}

// soft delete absen
AbsenService.deleteAbsen = async ( absenId, userSub ) => {
    const deletedAbsen = await Absen.query().where('eabsenid', absenId).update({
        eabsendeleteby: userSub,
        eabsendeletetime: new Date(Date.now()),
        eabsendeletestatus: 1
    });

    return deletedAbsen;
}

module.exports = AbsenService;