const ClassCategoryParticipant = require('../../models/v2/ClassCategoryParticipant');

const classCategoryParticipantService = {};

classCategoryParticipantService.getParticipantsCountByClassUuid = async (classUuid) => {

    return ClassCategoryParticipant.query()
        .where('class_uuid', classUuid)
        .count()
        .then(count => {
            return parseInt(count[0].count);
        })

}

classCategoryParticipantService.getClassParticipants = async (classUuid) => {

    if (classUuid) {

        const classParticipants = await ClassCategoryParticipant.query()
            .modify('withCategory')
            .where('class_uuid', classUuid)

        let grouped = {};
        classParticipants.map(classParticipant => {
            if (!grouped[classParticipant.classCategoryUuid])
                grouped[classParticipant.classCategoryUuid] = {
                    uuid: classParticipant.uuid,
                    classCategoryUuid: classParticipant.classCategory.uuid,
                    classCategoryTitle: classParticipant.classCategory.title,
                    user: [],
                };

            grouped[classParticipant.classCategoryUuid].user.push({
                ...classParticipant.user
            });
        });

        const result = Object.keys(grouped)
            .map(function(key) {
                return grouped[key];
            })

        return result;

    }

}

module.exports = classCategoryParticipantService;