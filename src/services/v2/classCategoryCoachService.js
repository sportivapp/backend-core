const ClassCategoryCoach = require('../../models/v2/ClassCategoryCoach');

const classCategoryCoachService = {};

classCategoryCoachService.initCategoryCoach = async (categoryCoachDTO, user, trx) => {

    return ClassCategoryCoach.query(trx)
        .insertToTable(categoryCoachDTO, user.sub);

};

classCategoryCoachService.saveCoach = async (categoryDTO, user, trx) => {

    const coaches = await ClassCategoryCoach.query(trx)
        .where('class_category_uuid', categoryDTO.uuid);
    const coachesUserIds = coaches.map(coach => {
        return coach.userId;
    });

    const newCoachesUserIds = categoryDTO.categoryCoachUserIds.filter(userId => !coachesUserIds.includes(userId));
    const removedCoachesUserIds = coachesUserIds.filter(userId => !categoryDTO.categoryCoachUserIds.includes(userId));

    const newCoaches = newCoachesUserIds.map(userId => {
        return {
            classUuid: categoryDTO.classUuid,
            classCategoryUuid: categoryDTO.uuid,
            userId: userId,
        }
    });

    if (removedCoachesUserIds !== 0) {
        await ClassCategoryCoach.query(trx)
            .whereIn('user_id', removedCoachesUserIds)
            .delete();
    }

    // No new coach, only remove
    if (newCoaches.length === 0)
        return;

    return ClassCategoryCoach.query(trx)
        .insertToTable(newCoaches, user.sub);

}

module.exports = classCategoryCoachService;