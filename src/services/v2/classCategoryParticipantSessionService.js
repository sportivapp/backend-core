const classCategoryParticipantSessionService = {};

classCategoryParticipantSessionService.getSessionParticipants = async (sessionUuid) => {

    return ClassCategoryParticipantSession.query()
        .modify('participants')
        .where('class_category_session_uuid', sessionUuid)
        .where('is_check_in', null);

}

module.exports = classCategoryParticipantSessionService;