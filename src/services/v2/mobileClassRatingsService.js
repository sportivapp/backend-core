const ClassRatings = require('../../models/v2/ClassRatings');
const ratingImprovementEnum = require('../../models/enum/RatingImprovementEnum');
const { UnsupportedOperationError } = require('../../models/errors');
const classRatingImprovementsService = require('./mobileClassRatingImprovement');

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

module.exports = mobileClassRatingsService;