const ClassComplaints = require('../../models/v2/ClassComplaints');
const { UnsupportedOperationError } = require('../../models/errors');
const classCategoryCoachService = require('./mobileClassCategoryCoachService');
const classComplaintMediaService = require('./mobileClassComplaintMediasService');
const classComplaintStatusEnum = require('../../models/enum/ClassComplaintStatusEnum');

const ErrorEnum = {
    DOUBLE_COMPLAINT: 'DOUBLE_COMPLAINT',
    INVALID_STATUS: 'INVALID_STATUS',
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

mobileClassComplaintService.getMyComplaints = async (user, status) => {

    if (!classComplaintStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    return ClassComplaints.query()
        .modify('myComplaints')
        .where('create_by', user.sub)
        .where('status', status);

}

mobileClassComplaintService.getCoachComplaints = async (user, status) => {

    if (!classComplaintStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    const categoryUuids = await classCategoryCoachService.getCoachCategoryUuidsByUserId(user.sub);

    if (categoryUuids.length === 0)
        return [];

    return ClassComplaints.query()
        .modify('coachComplaints')
        .whereIn('class_category_uuid', categoryUuids)
        .where('status', status);

}

mobileClassComplaintService.coachAcceptComplaint = async (classComplaintUuid, user) => {

    return ClassComplaints.query()
        .findById(classComplaintUuid)
        .updateByUserId({
            coachAccept: true,
            status: classComplaintStatusEnum.ON_PROGRESS,
        }, user.sub)
        .returning('*');

}

mobileClassComplaintService.coachRejectComplaint = async (classComplaintUuid, coachReason, fileIds, user) => {

    return ClassComplaints.transaction(async trx => {

        const complaint = await ClassComplaints.query(trx)
            .findById(classComplaintUuid)
            .updateByUserId({
                coachAccept: false,
                coachReason: coachReason,
                status: classComplaintStatusEnum.ON_PROGRESS,
            }, user.sub)
            .returning('*');

        const complaintMediaDTOs = fileIds.map(fileId => {
            return {
                fileId: fileId,
                classComplaintUuid: complaint.uuid,
            }
        });

        await classComplaintMediaService.insertComplaintMedias(complaintMediaDTOs, user, trx);

        return complaint;

    });

}

mobileClassComplaintService.getCategoryComplaints = (classCategoryUuid, status) => {
    
    if (!classComplaintStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    return ClassComplaints.query()
        .modify('fullComplaint')
        .where('class_category_uuid', classCategoryUuid)
        .where('status', status);

}

module.exports = mobileClassComplaintService;