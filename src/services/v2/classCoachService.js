const { UnsupportedOperationError } = require('../../models/errors');
const ClassCoach = require('../../models/v2/ClassCoach');

const ErrorEnum = {
    EMPTY_COACH: 'EMPTY_COACH',
}

const classCoachService = {};

classCoachService.initClassCoach = async (classCoachDTO, user, trx) => {

    return ClassCoach.query(trx)
        .insertToTable(classCoachDTO, user.sub);

};

classCoachService.getCoaches = async (classUuid) => {

    return ClassCoach.query()
        .modify('baseAttributes')
        .where('class_uuid', classUuid);

}

classCoachService.getCoachesByUuids = async (classCoachUuids) => {

    return ClassCoach.query()
        .modify('basic')
        .whereIn('uuid', classCoachUuids);

}

classCoachService.saveCoach = async (classUuid, classCoachUserIds, user, trx) => {

    const coaches = await ClassCoach.query(trx)
        .where('class_uuid', classUuid);
    const coachesUserIds = coaches.map(coach => {
        return coach.userId;
    });

    const newCoachesUserIds = classCoachUserIds.filter(userId => !coachesUserIds.includes(userId));
    const removedCoachesUserIds = coachesUserIds.filter(userId => !classCoachUserIds.includes(userId));

    const newCoaches = newCoachesUserIds.map(userId => {
        return {
            classUuid: classUuid,
            userId: userId,
        }
    });

    if (removedCoachesUserIds !== 0) {
        await ClassCoach.query(trx)
            .whereIn('user_id', removedCoachesUserIds)
            .delete();
    }

    // No new coach, only remove
    if (newCoaches.length === 0)
        return;

    return ClassCoach.query(trx)
        .insertToTable(newCoaches, user.sub);

}

module.exports = classCoachService;