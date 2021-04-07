const ClassComplaints = require('../../models/v2/ClassComplaints');
const { UnsupportedOperationError } = require('../../models/errors');
const classCategoryCoachService = require('./mobileClassCategoryCoachService');
const classComplaintMediaService = require('./mobileClassComplaintMediasService');
const classComplaintStatusEnum = require('../../models/enum/ClassComplaintStatusEnum');
const zeroPrefixHelper = require('../../helper/zeroPrefixHelper');
const ClassTransactionSequence = require('../../models/v2/ClassComplaintSequence');
const { moduleTransactionEnum, moduleEnum } = require('../../models/enum/ModuleTransactionEnum');
const dateFormatter = require('../../helper/dateFormatter');
const notificationService = require('../notificationService');
const NotificationEnum = require('../../models/enum/NotificationEnum');
const CodeToTextMonthEnum = require('../../models/enum/CodeToTextMonthEnum');

const ErrorEnum = {
    DOUBLE_COMPLAINT: 'DOUBLE_COMPLAINT',
    INVALID_STATUS: 'INVALID_STATUS',
}
const DAY_IN_MILLIS = 86400000;
const MINUTE_IN_MILLIS = 60000;

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

    const complaintIdCode = await ClassTransactionSequence.getNextVal();
    const prefixedCode = zeroPrefixHelper.zeroPrefixCodeByLength(complaintIdCode, 9);
    const complaintId = `CMP/${dateFormatter.formatDateToYYYYMMDD(new Date())}/${moduleTransactionEnum[moduleEnum.CLASS]}/${prefixedCode}`;

    classComplaintsDTO.complaintId = complaintId;
    classComplaintsDTO.complaintIdCode = complaintIdCode;

    return ClassComplaints.query()
        .insertToTable(classComplaintsDTO, user.sub);

}

mobileClassComplaintService.checkNewComplaints = async (sessions) => {

    const promises = sessions.map(async session => {
        const completeSession = await session.$query().withGraphFetched('[class, classCategory.coaches]');
        const category = completeSession.classCategory;
        const cls = completeSession.class;
        const coaches = completeSession.classCategory.coaches;
        const complaints = await ClassComplaints.query()
            .where('class_category_session_uuid', session.uuid)
            .then(complaints => complaints.filter(complaint => Date.now() - complaint.createTime <= MINUTE_IN_MILLIS));
        if (complaints.length <= 0) return null;
        const sessionDate = new Date(parseInt(session.startDate));
        const user = await complaints[0].$relatedQuery('user');
        const action = complaints.length > 1 ? NotificationEnum.classSession.actions.newComplaints : NotificationEnum.classSession.actions.newComplaint;
        const additionalInfo = {
            param1: complaints.length > 1 ? complaints.length : user.eusername,
            param2: `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`
        }
        const notificationObj = await notificationService.buildNotificationEntity(
            session.uuid,
            NotificationEnum.classSession.type,
            action.title(cls.title, category.title),
            action.message(additionalInfo.param1, additionalInfo.param2),
            action.code);
        return notificationService.saveNotification(notificationObj, { sub: user.euserid }, coaches.map(coach => coach.userId));
    })

    return Promise.all(promises);

}

mobileClassComplaintService.getMyCategoryComplaints = async (classCategoryUuid, status, user) => {

    if (!classComplaintStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    return ClassComplaints.query()
        .modify('myCategoryComplaints')
        .where('class_category_uuid', classCategoryUuid)
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

    const updatedData = await ClassComplaints.query()
        .findById(classComplaintUuid)
        .updateByUserId({
            coachAccept: true,
            status: classComplaintStatusEnum.ON_PROGRESS,
        }, user.sub)
        .returning('*');

    const completeComplaint = await updatedData.$query().withGraphFetched('[classCategorySession.participantSession, classCategory, class]');

    const session = completeComplaint.classCategorySession;
    const participants = session.participantSession;
    const category = completeComplaint.classCategory;
    const cls = completeComplaint.class;

    const sessionDate = new Date(parseInt(session.startDate));

    const notifAction = NotificationEnum.classSession.actions.acceptComplaint;

    const sessionTitle = `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;

    const notificationObj = await notificationService.buildNotificationEntity(
        updatedData.classCategorySessionUuid,
        NotificationEnum.classSession.type,
        notifAction.title(cls.title, category.title),
        notifAction.message(sessionTitle),
        notifAction.code
    );

    notificationService.saveNotification(notificationObj, user, participants.map(participant => participant.userId));

    return updatedData;

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

        const completeComplaint = await complaint.$query().withGraphFetched('[classCategorySession.participantSession, classCategory, class]')

        const session = completeComplaint.classCategorySession;
        const participants = session.participantSession;
        const category = completeComplaint.classCategory;
        const cls = completeComplaint.class;

        const sessionDate = new Date(parseInt(session.startDate));

        const notifAction = NotificationEnum.classSession.actions.rejectComplaint;

        const sessionTitle = `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;

        const notificationObj = await notificationService.buildNotificationEntity(
            complaint.classCategorySessionUuid,
            NotificationEnum.classSession.type,
            notifAction.title(cls.title, category.title),
            notifAction.message(sessionTitle),
            notifAction.code
        );

        notificationService.saveNotification(notificationObj, user, participants.map(participant => participant.userId));

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