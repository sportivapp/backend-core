const ClassReasons = require('../../models/v2/ClassReasons');
const { UnsupportedOperationError } = require('../../models/errors');

const ErrorEnum = {
    DOUBLE_REASON: 'DOUBLE_REASON',
}

mobileClassReasonsService = {};

mobileClassReasonsService.checkExistUserReason = async (classCategorySessionUuid, user) => {

    return ClassReasons.query()
        .where('class_category_session_uuid', classCategorySessionUuid)
        .where('create_by', user.sub)
        .first()
        .then(reason => {
            if (reason)
                throw new UnsupportedOperationError(ErrorEnum.DOUBLE_REASON);
            return reason;
        });

}

mobileClassReasonsService.reason = async (classReasonsDTO, user) => {

    return ClassReasons.query()
        .insertToTable(classReasonsDTO, user.sub);

}

module.exports = mobileClassReasonsService;