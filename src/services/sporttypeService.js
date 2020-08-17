const SportType = require('../models/SportType');

const SportTypeService = {};

SportTypeService.getSportTypes = async () => {

    return SportType.query().select();

}

module.exports = SportTypeService;