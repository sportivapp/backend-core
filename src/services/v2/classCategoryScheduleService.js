const ClassCategorySchedule = require('../../models/v2/ClassCategorySchedule');

const classCategoryScheduleService = {};

classCategoryScheduleService.initSchedules = async (scheduleDTO, user, trx) => {

    return ClassCategorySchedule.query(trx)
        .insertToTable(scheduleDTO, user.sub);

}

classCategoryScheduleService.getSchedules = async (classCategoryUuid, user) => {

    return ClassCategorySchedule.query()
        .modify('latest')
        .where('class_category_uuid', classCategoryUuid);

};

module.exports = classCategoryScheduleService;