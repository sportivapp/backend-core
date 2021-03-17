const Class = require('../../models/v2/Class');
const classMediaService = require('./classMediaService');
const classCoachService = require('./classCoachService');
const classCategoriesService = require('./classCategoryService');
const { UnsupportedOperationError, NotFoundError } = require('../../models/errors');
const ServiceHelper = require('../../helper/ServiceHelper');
const classCategoryService = require('./classCategoryService');
const classCategorySessionService = require('./classCategorySessionService');

const ErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    PARTICIPANTS_EXISTED: 'PARTICIPANTS_EXISTED',
}

const classService = {};

classService.checkUserHaveCompanyId = (user) => {
    if (!user.companyId)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY);
}

classService.createClass = async (classDTO, fileIds, classCoachUserIds, categories, user) => {

    classService.checkUserHaveCompanyId(user);

    return Class.transaction(async trx => {

        const cls = await Class.query(trx)
            .insertToTable(classDTO, user.sub);

        const mediaDTO = fileIds.map(fileId => {
            return {
                classUuid: cls.uuid,
                fileId: fileId,
            }
        });

        const classCoachDTO = classCoachUserIds.map(classCoachUserId => {
            return {
                classUuid: cls.uuid,
                userId: classCoachUserId,
            }
        });

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

classService.getClasses = async (page, size, keyword, industryId, user) => {

    classService.checkUserHaveCompanyId(user);

    let clsPromise = Class.query()
        .modify('adminList')
        .where('company_id', user.companyId)
        .whereRaw(`LOWER("title") LIKE LOWER('%${keyword}%')`)

    if (industryId)
        clsPromise = clsPromise.where('industry_id', industryId);

    const pageObj = await clsPromise.page(page, size);

    const resultPromise = pageObj.results.map(async cls => {
        return {
            ...cls,
            priceRange: await classCategoryService.getClassCategoryPriceRangeByClassUuid(cls.uuid),
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

classService.getClass = async (classUuid, user) => {

    classService.checkUserHaveCompanyId(user);

    const cls = await Class.query()
        .modify('adminDetail')
        .where('company_id', user.companyId)
        .findById(classUuid)
        .then(cls => {
            if (!cls)
                throw new NotFoundError();
            cls.administrationFee = parseInt(cls.administrationFee);
            return cls;
        });

    const promises = cls.classCategories.map(async category => {
        category.price = parseInt(category.price);
        return category;
    });

    await Promise.all(promises);

    return {
        ...cls,
        priceRange: await classCategoryService.getClassCategoryPriceRangeByClassUuid(cls.uuid),
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

classService.checkUserInClassCompany = async (classUuid, user) => {

    const cls = await classService.findById(classUuid);
    if (cls.companyId !== user.companyId)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY);

}

classService.getClassCategory = async (classUuid, classCategoryUuid, user) => {

    await classService.checkUserInClassCompany(classUuid, user);
    return classCategoriesService.getClassCategory(classCategoryUuid);

}

classService.deleteClass = async (classUuid, user) => {

    await classService.checkUserInClassCompany(classUuid, user);

    const cls = await classService.findById(classUuid);

    if (totalParticipants !== 0)
        throw new UnsupportedOperationError(ErrorEnum.PARTICIPANTS_EXISTED);
    else {
        return cls.$query()
            .softDelete()
            .then(rowsAffected => rowsAffected === 1);
    }

}

classService.reschedule = async (classUuid, classCategorySessionDTO, isRepeat, user) => {

    await classService.checkUserInClassCompany(classUuid, user);
    return classCategorySessionService.reschedule(classCategorySessionDTO, isRepeat, user);

}

classService.getClassParticipants = async (classUuid, user) => {

    await classService.checkUserInClassCompany(classUuid, user);
    return Class.query()
        .modify('participants')
        .findById(classUuid);

}

classService.getClassCoaches = async (classUuid, user) => {

    await classService.checkUserInClassCompany(classUuid, user);
    return await classCoachService.getCoaches(classUuid);

}

classService.updateCategory = async (categoryDTO, user) => {

    await classService.checkUserInClassCompany(categoryDTO.classUuid, user);
    return classCategoryService.updateCategory(categoryDTO, user);

}

classService.deleteCategory = async (classUuid, classCategoryUuid, user) => {

    await classService.checkUserInClassCompany(classUuid, user);
    return classCategoryService.deleteCategory(classCategoryUuid);

}

classService.addCategory = async (startMonth, endMonth, category, user) => {

    await classService.checkUserInClassCompany(category.classUuid, user);
    return classCategoryService.addCategory(startMonth, endMonth, category, user);

}

classService.updateClass = async (classDTO, user) => {

    await classService.checkUserInClassCompany(classDTO.uuid, user);

    const newClass = {
        uuid: classDTO.uuid,
        title: classDTO.title,
        description: classDTO.description,
        address: classDTO.address,
        addressName: classDTO.addressName,
        picId: classDTO.picId,
        picMobileNumber: classDTO.picMobileNumber,
        administrationFee: classDTO.administrationFee,
    };

    const cls = await classService.findById(classDTO.uuid);

    return Class.transaction(async trx => {

        const updatedClass = await cls.$query(trx)
            .updateByUserId(newClass, user.sub)
            .returning('*');

        const classCoach = await classCoachService.saveCoach(classDTO.uuid, classDTO.classCoachUserIds, user, trx);
        const classMedia = await classMediaService.saveMedia(classDTO.uuid, classDTO.fileIds, user, trx);

        return {
            ...updatedClass,
            classMedia: classMedia,
            classCoach: classCoach,
        }
        
    });

}

module.exports = classService;