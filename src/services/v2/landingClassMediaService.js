const ClassMedia = require('../../models/v2/ClassMedia');

const classMediaService = {};

classMediaService.initMedia = async (mediaDTO, user, trx) => {

    return ClassMedia.query(trx)
        .insertToTable(mediaDTO, user.sub);

};

module.exports = classMediaService;