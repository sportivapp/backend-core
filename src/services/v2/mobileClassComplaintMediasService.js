const ClassComplaintMedias = require('../../models/v2/ClassComplaintMedias');

const mobileClassComplaintMediasService = {};

mobileClassComplaintMediasService.insertComplaintMedias = async (complaintMediaDTOs, user, trx) => {

    return ClassComplaintMedias.query(trx)
        .insertToTable(complaintMediaDTOs, user.sub);

}

module.exports = mobileClassComplaintMediasService;