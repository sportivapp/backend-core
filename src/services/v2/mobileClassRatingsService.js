const ClassRatings = require('../../models/v2/ClassRatings');
const ratingImprovementEnum = require('../../models/enum/RatingImprovementEnum');
const { UnsupportedOperationError } = require('../../models/errors');
const classRatingImprovementsService = require('./mobileClassRatingImprovement');
const notificationService = require('../notificationService');
const NotificationEnum = require('../../models/enum/NotificationEnum');
const CodeToTextMonthEnum = require('../../models/enum/CodeToTextMonthEnum');

const ErrorEnum = {
    INVALID_IMPROVEMENT_CODE: 'INVALID_IMPROVEMENT_CODE',
    DOUBLE_RATING: 'DOUBLE_RATING',
}

mobileClassRatingsService = {};

mobileClassRatingsService.checkExistUserRating = async (classCategorySessionUuid, user) => {

    return ClassRatings.query()
        .where('class_category_session_uuid', classCategorySessionUuid)
        .where('create_by', user.sub)
        .first()
        .then(rating => {
            if (rating)
                throw new UnsupportedOperationError(ErrorEnum.DOUBLE_RATING);
            return rating;
        });

}

mobileClassRatingsService.rate = async (classRatingsDTO, improvementCodes, user) => {

    improvementCodes.forEach(improvementCode => {
        if (!ratingImprovementEnum[improvementCode])
            throw new UnsupportedOperationError(ErrorEnum.INVALID_IMPROVEMENT_CODE);
    });

    return ClassRatings.transaction(async trx => {

        const rating = await ClassRatings.query()
            .insertToTable(classRatingsDTO, user.sub);

        const ratingImprovementDTOs = improvementCodes.map(improvementCode => {
            return {
                classRatingUuid: rating.uuid,
                code: improvementCode,
            }
        });

        const improvements = await classRatingImprovementsService.addRatingImprovements(ratingImprovementDTOs, trx);

        return {
            ...rating,
            improvements: improvements,
        }

    });

}

mobileClassRatingsService.checkNewRatings = async (sessions) => {

    const promises = sessions.map(async session => {
        const completeSession = await session.$query().withGraphFetched('[class, classCategory.coaches]')
        const cls = completeSession.class;
        const category = completeSession.classCategory;
        const coaches = category.coaches;
        const ratings = await ClassRatings.query()
            .where('class_category_session_uuid', session.uuid)
            .then(ratings => ratings.filter(rating => Date.now() - rating.createTime <= MINUTE_IN_MILLIS));
        if (ratings.length <= 0) return null;
        const sessionDate = new Date(parseInt(session.startDate));
        const user = await ratings[0].$relatedQuery('user');
        const action = ratings.length > 1 ? NotificationEnum.classSession.actions.newRatings : NotificationEnum.classSession.actions.newRating;
        const additionalInfo = {
            param1: ratings.length > 1 ? ratings.length : user.eusername,
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

module.exports = mobileClassRatingsService;