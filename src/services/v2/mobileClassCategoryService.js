const ClassCategory = require('../../models/v2/ClassCategory');

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

module.exports = classCategoryService;