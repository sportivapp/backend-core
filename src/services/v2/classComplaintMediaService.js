const ClassComplaintMedias = require('../../models/v2/ClassComplaintMedias');

const classComplaintMediasService = {};

classComplaintMediasService.insertComplaintMedias = async (complaintMediaDTOs, user, trx) => {

    return ClassComplaintMedias.query(trx)
        .insertToTable(complaintMediaDTOs, user.sub);

}

module.exports = classComplaintMediasService;