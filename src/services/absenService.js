const Absen = require('../models/Absen');
const Image = require('../models/Image');
const Location = require('../models/Location');
const ServiceHelper = require('../helper/ServiceHelper')

const AbsenService = {};

AbsenService.createAbsenByPOS = async ( absenDTO, imageDTO ) => {
    
    const absen = await Absen.query().insert(absenDTO);

    const image = await Image.query().insert(imageDTO);

    return { absen, image };
}

AbsenService.listAbsenById = async ( page, size, userId ) => {
    const absenPage = await Absen.query().select().where('eusereuserid', userId).andWhere('eabsendeletestatus', 0).orderBy('eabsencreatetime', 'asc').page(page, size);

    return ServiceHelper.toPageObj(page, size, absenPage);
}

AbsenService.listAbsen = async ( page, size ) => {
    const absenPage = await Absen.query().select().where('eabsendeletestatus', 0).orderBy('eabsencreatetime').page(page, size);

    return ServiceHelper.toPageObj(page, size, absenPage);
}

AbsenService.editAbsen = async ( absenId, absenDTO, user ) => {
    const absen = await Absen.query().where('eabsenid', absenId).andWhere('eusereuserid', user.sub).update(absenDTO);

    if (user.permission !== 1 && absen) return

    return absen;
}

// soft delete absen
AbsenService.deleteAbsen = async ( absenId, user ) => {
    const absen = await Absen.query().where('eabsenid', absenId).andWhere('eusereuserid', user.sub).update({
        eabsendeleteby: user.sub,
        eabsendeletetime: new Date(Date.now()),
        eabsendeletestatus: 1
    });

    if (user.permission !== 1 && absen) return

    return absen;
}

AbsenService.createLocation = async ( locationDTO ) => {

    const location = await Location.query().insert(locationDTO);

    return location;
}

module.exports = AbsenService;