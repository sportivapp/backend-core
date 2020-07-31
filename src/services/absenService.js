const Absen = require('../models/Absen');
const Image = require('../models/Image');
const Location = require('../models/Location');

const AbsenService = {};

AbsenService.createAbsenByPOS = async ( absenDTO, imageDTO ) => {
    
    const absen = await Absen.query().insert(absenDTO);

    const image = await Image.query().insert(imageDTO);

    return { absen, image };
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

AbsenService.createLocation = async ( locationDTO ) => {

    const location = await Location.query().insert(locationDTO);

    return location;
}

module.exports = AbsenService;