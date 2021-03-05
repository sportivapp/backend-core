const ClassCategorySchedule = require('../../models/v2/ClassCategorySchedule');

const classCategoryScheduleService = {};

classCategoryScheduleService.initSchedules = async (scheduleDTO, user, trx) => {

    return ClassCategorySchedule.query(trx)
        .insertToTable(scheduleDTO, user.sub);

}

classCategoryScheduleService.getSchedules = async (classCategoryUuid, user) => {

    return ClassCategorySchedule.query()
        .modify('list')
        .where('class_category_uuid', classCategoryUuid);

};

classCategoryScheduleService.renewSchedules = async (classCategoryUuid, scheduleDTO, user) => {

    return ClassCategorySchedule.transaction(async trx => {

        await ClassCategorySchedule.query(trx)
            .where('class_category_uuid', classCategoryUuid)
            .delete();

        return ClassCategorySchedule.query(trx)
            .insertToTable(scheduleDTO, user.sub);

    });

}

module.exports = classCategoryScheduleService;