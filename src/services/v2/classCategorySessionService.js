const { NotFoundError } = require('../../models/errors');
const ClassCategorySession = require('../../models/v2/ClassCategorySession');

const classCategorySessionService = {};

classCategorySessionService.initCategorySession = async (sessionDTO, user, trx) => {

    return ClassCategorySession.query(trx)
        .insertToTable(sessionDTO, user.sub);

};

classCategorySessionService.findById = async (classCategorySessionUuid) => {

    return ClassCategorySession.query()
        .findById(classCategorySessionUuid)
        .then(session => {
            if (!session)
                throw new NotFoundError();
            return session;
        });

}

classCategorySessionService.reschedule = async (classCategorySessionDTO, user) => {

    const session = await classCategorySessionService.findById(classCategorySessionDTO.uuid);

    return session.$query()
        .updateByUserId(classCategorySessionDTO, user.sub)
        .returning('*');

}

module.exports = classCategorySessionService;