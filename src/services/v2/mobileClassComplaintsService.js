const ClassComplaints = require('../../models/v2/ClassComplaints');
const { UnsupportedOperationError } = require('../../models/errors');
const classCategoryCoachService = require('./mobileClassCategoryCoachService');

const ErrorEnum = {
    DOUBLE_COMPLAINT: 'DOUBLE_COMPLAINT',
}

const mobileClassComplaintService = {};

mobileClassComplaintService.checkExistUserComplaint = async (classCategorySessionUuid, user) => {

    return ClassComplaints.query()
        .where('class_category_session_uuid', classCategorySessionUuid)
        .where('create_by', user.sub)
        .first()
        .then(complaint => {
            if (complaint)
                throw new UnsupportedOperationError(ErrorEnum.DOUBLE_COMPLAINT);
            return complaint;
        });

}

mobileClassComplaintService.complaintSession = async (classComplaintsDTO, user) => {

    return ClassComplaints.query()
        .insertToTable(classComplaintsDTO, user.sub);

}

mobileClassComplaintService.getMyComplaints = async (user) => {

    return ClassComplaints.query()
        .modify('myComplaints')
        .where('create_by', user.sub);

}

mobileClassComplaintService.getCoachComplaints = async (user) => {

    const categoryUuids = await classCategoryCoachService.getCoachCategoryUuidsByUserId(user.sub);

    console.log(categoryUuids)
    if (categoryUuids.length === 0)
        return [];

    return ClassComplaints.query()
        .modify('coachComplaints')
        .whereIn('class_category_uuid', categoryUuids);

}

module.exports = mobileClassComplaintService;