const ClassCategory = require('../../models/v2/ClassCategory');
const classCategoryParticipantService = require('./mobileClassCategoryParticipantService');

const classCategoryService = {};

classCategoryService.getClassCategory = async (classCategoryUuid) => {

    return ClassCategory.query()
        .modify('detail')
        .findById(classCategoryUuid)
        .then(classCategory => {
            if (!classCategory)
                throw new NotFoundError();
            return classCategory;
        })

}

classCategoryService.register = async (classCategoryUuid, user) => {

    return classCategoryParticipantService.register(classCategoryUuid, user);

}

module.exports = classCategoryService;