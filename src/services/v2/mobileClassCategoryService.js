const ClassCategory = require('../../models/v2/ClassCategory');

const classCategoryService = {};

classCategoryService.getClassCategory = async (classCategoryUuid) => {

    return ClassCategory.query()
        .modify('userDetail')
        .findById(classCategoryUuid)
        .then(classCategory => {
            if (!classCategory)
                throw new NotFoundError();
            return classCategory;
        })

}

classCategoryService.getClassCategoryPriceRangeByClassUuid = async (classUuid) => {

    const prices = await ClassCategory.query()
        .modify('price')
        .where('class_uuid', classUuid);

    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    for (let i=0;i<prices.length;i++) {
        const price = parseInt(prices[i].price);
        if (price < min)
            min = price;
        if (parseInt(price) > max)
            max = price;
    }

    return {
        minPrice: min,
        maxPrice: max,
    }

}


module.exports = classCategoryService;