const classComplaintService = {};
const ClassComplaints = require('../../models/v2/ClassComplaints');
const { UnsupportedOperationError } = require('../../models/errors');
const classComplaintMediaService = require('./classComplaintMediaService');
const classComplaintStatusEnum = require('../../models/enum/ClassComplaintStatusEnum');

const ErrorEnum = {
    INVALID_STATUS: 'INVALID_STATUS',
}

classComplaintService.coachAcceptComplaint = async (classComplaintUuid, user) => {

    return ClassComplaints.query()
        .findById(classComplaintUuid)
        .updateByUserId({
            coachAccept: true,
            status: classComplaintStatusEnum.ON_PROGRESS,
        }, user.sub)
        .returning('*');

}

classComplaintService.coachRejectComplaint = async (classComplaintUuid, coachReason, fileIds, user) => {

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

classComplaintService.getCategoryComplaints = (classCategoryUuid, status) => {
    
    if (!classComplaintStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    return ClassComplaints.query()
        .modify('fullComplaint')
        .where('class_category_uuid', classCategoryUuid)
        .where('status', status);

}

module.exports = classComplaintService;