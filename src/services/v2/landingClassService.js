const Class = require('../../models/v2/Class');
const ServiceHelper = require('../../helper/ServiceHelper');
const classCategoryParticipantSessionService = require('./landingClassCategoryParticipantSessionService');
const classCategoriesService = require('./landingClassCategoriesService');
const classCoachService = require('./landingClassCoachService');
const classMediaService = require('./landingClassMediaService');
const { NotFoundError } = require('../../models/errors');

const ErrorEnum = {
    PARTICIPANTS_EXISTED: 'PARTICIPANTS_EXISTED',
    NOT_CLASS_OWNER: 'NOT_CLASS_OWNER',
}

const classService = {};

classService.createClass = async (classDTO, fileIds, categories, user) => {

    return Class.transaction(async trx => {

        const cls = await Class.query(trx)
            .insertToTable(classDTO, user.sub);

        const mediaDTO = fileIds.map(fileId => {
            return {
                classUuid: cls.uuid,
                fileId: fileId,
            }
        });

        const classCoachDTO = {
            classUuid: cls.uuid,
            userId: user.sub,
        };

        categories = categories.map(category => {
            return {
                classUuid: cls.uuid,
                ...category,
            }
        });

        const classMedia = await classMediaService.initMedia(mediaDTO, user, trx);
        const classCoaches = await classCoachService.initClassCoach(classCoachDTO, user, trx);
        const classCategory = await classCategoriesService.initCategories(categories, user, trx);

        return {
            ...cls,
            classMedia: classMedia,
            classCoaches: classCoaches,
            classCategory: classCategory,
        };

    });

};

classService.getClasses = async (page, size, keyword, industryId, cityId, companyId) => {

    let clsPromise = Class.query()
        .modify('landingList')
        .whereRaw(`LOWER("title") LIKE LOWER('%${keyword}%')`)

    if (industryId)
        clsPromise = clsPromise.where('industry_id', industryId);

    if (cityId)
        clsPromise = clsPromise.where('city_id', cityId);

    if (companyId)
        clsPromise = clsPromise.where('company_id', companyId);

    const pageObj = await clsPromise.page(page, size);

    const resultPromise = pageObj.results.map(async cls => {
        return {
            ...cls,
            startFrom: await classService.getClassStartFromPrice(cls.uuid),
            totalParticipants: await classCategoryParticipantSessionService.getTotalParticipantsByClassUuid(cls.uuid),
        }
    });
    
    return Promise.all(resultPromise)
        .then(cList => {
            pageObj.results = cList.map(cls => {
                cls.administrationFee = parseInt(cls.administrationFee);
                return cls;
            });
            return pageObj;
        })
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));

}

classService.getClassStartFromPrice = async (classUuid) => {

    const startFrom = await Class.query()
        .findById(classUuid)
        .modify('prices')
        .then(cls => {
            let lowestPrice = Number.MAX_VALUE;
            cls.classCategories.map(category => {
                const categoryPriceInt = parseInt(category.price);
                if (categoryPriceInt < lowestPrice)
                    lowestPrice = categoryPriceInt;
                category.categorySessions.map(session => {
                    const sessionPriceInt = parseInt(session.price);
                    if (sessionPriceInt < lowestPrice)
                        lowestPrice = sessionPriceInt;
                });
            });
            return lowestPrice;
        });

    return parseInt(startFrom);

}

classService.getMyCreatedClasses = async (page, size, keyword, user) => {

    let clsPromise = Class.query()
        .modify('landingList')
        .whereRaw(`LOWER("title") LIKE LOWER('%${keyword}%')`)
        .andWhere('create_by', user.sub)

    const pageObj = await clsPromise.page(page, size);

    const resultPromise = pageObj.results.map(async cls => {
        return {
            ...cls,
            startFrom: await classService.getClassStartFromPrice(cls.uuid),
            totalParticipants: await classCategoryParticipantSessionService.getTotalParticipantsByClassUuid(cls.uuid),
        }
    });
    
    return Promise.all(resultPromise)
        .then(cList => {
            pageObj.results = cList.map(cls => {
                cls.administrationFee = parseInt(cls.administrationFee);
                return cls;
            });
            return pageObj;
        })
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));

}

classService.getLandingClassDetail = async (classUuid, user) => {

    const cls = await Class.query()
        .modify('landingDetail')
        .findById(classUuid)
        .then(cls => {
            if (!cls)
                throw new NotFoundError();
            cls.administrationFee = parseInt(cls.administrationFee);
            return cls;
        });

    const newCategories = cls.classCategories.map(async category => {
        priceRange = await classCategoriesService.getCategoryPriceRange(category.uuid)
        
        return {
            ...category,
            priceRange: priceRange
        }
    });

    await Promise.all(newCategories)
        .then(newCategories => {
            cls.classCategories = newCategories;
        });

    return {
        ...cls,
        totalParticipants: await classCategoryParticipantSessionService.getTotalParticipantsByClassUuid(cls.uuid),
        isOwner: classService.isClassCreatedByUser(cls, user.sub),
    }

}

classService.findById = async (classUuid) => {

    return Class.query()
        .findById(classUuid)
        .then(cls => {
            if (!cls)
                throw new NotFoundError();
            cls.administrationFee = parseInt(cls.administrationFee);
            return cls;
        });

}

classService.isClassCreatedByUser = (cls, userId) => {

    return cls.createBy === userId;

}

classService.checkIsClassOwner = async (classUuid, user) => {
    
    const cls = await classService.findById(classUuid);
    const isOwner = classService.isClassCreatedByUser(cls, user.sub);

    if (!isOwner) {
        throw new UnsupportedOperationError(ErrorEnum.NOT_CLASS_OWNER);
    }

    return isOwner;

}

classService.deleteCategory = async (classUuid, categoryUuid, user) => {

    await classService.checkIsClassOwner(classUuid, user);

    return classCategoriesService.deleteCategory(categoryUuid, user);

}

classService.updateClass = async (classDTO, user) => {

    const cls = await classService.findById(classDTO.uuid);

    isOwner = classService.isClassCreatedByUser(cls, user.sub);
    if (!isOwner) {
        throw new UnsupportedOperationError(ErrorEnum.NOT_CLASS_OWNER);
    }

    const newClass = {
        uuid: classDTO.uuid,
        description: classDTO.description,
        address: classDTO.address,
        addressName: classDTO.addressName,
        administrationFee: classDTO.administrationFee,
    };

    return Class.transaction(async trx => {

        const updatedClass = await cls.$query(trx)
            .updateByUserId(newClass, user.sub)
            .returning('*');

        const classMedia = await classMediaService.saveMedia(classDTO.uuid, classDTO.fileIds, user, trx);

        return {
            ...updatedClass,
            classMedia: classMedia,
        }
        
    });

}

classService.deleteClass = async (classUuid, user) => {

    const cls = await classService.findById(classUuid);

    isOwner = classService.isClassCreatedByUser(cls, user.sub);
    if (!isOwner) {
        throw new UnsupportedOperationError(ErrorEnum.NOT_CLASS_OWNER);
    }

    return cls.$query()
        .softDelete()
        .then(rowsAffected => rowsAffected === 1);

}

classService.addCategory = async (category, user) => {

    const cls = await classService.findById(category.classUuid);

    isOwner = classService.isClassCreatedByUser(cls, user.sub);
    if (!isOwner) {
        throw new UnsupportedOperationError(ErrorEnum.NOT_CLASS_OWNER);
    }

    return Class.transaction(async trx => {

        const classCoachDTO = {
            classUuid: cls.uuid,
            userId: user.sub,
        };

        const classCoaches = await classCoachService.initClassCoach(classCoachDTO, user, trx);
        const classCategory = await classCategoriesService.initCategories([category], user, trx);

        return {
            ...cls,
            classCoaches: classCoaches,
            classCategory: classCategory,
        };

    });

};

module.exports = classService;