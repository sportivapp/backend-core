const { UnsupportedOperationError } = require('../../models/errors');
const ClassCategoryCoach = require('../../models/v2/ClassCategoryCoach');

const ErrorEnum = {
    NOT_CATEGORY_COACH: 'NOT_CATEGORY_COACH',
}

const classCategoryCoachService = {};

classCategoryCoachService.getCoachCategory = (userId, categoryUuid) => {

    return ClassCategoryCoach.query()
        .where('user_id', userId)
        .andWhere('class_category_uuid', categoryUuid)
        .first();

}

classCategoryCoachService.checkCoachCategory = (userId, categoryUuid) => {

    return ClassCategoryCoach.query()
        .where('user_id', userId)
        .andWhere('class_category_uuid', categoryUuid)
        .first()
        .then(coach => {
            if (!coach)
                throw new UnsupportedOperationError(ErrorEnum.NOT_CATEGORY_COACH);
            return coach;
        });

}

module.exports = classCategoryCoachService;