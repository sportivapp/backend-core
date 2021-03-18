const ClassComplaints = require('../../models/v2/ClassComplaints');

const mobileClassComplaintService = {};

mobileClassComplaintService.complaintSession = async (classComplaintsDTO, user) => {

    return ClassComplaints.query()
        .insertToTable(classComplaintsDTO, user.sub);

}

module.exports = mobileClassComplaintService;