const cityService = require('../cityService');
const luxon = require('luxon');

const classCategorySessionService = {};

classCategorySessionService.convertStartEndToTimezone = (start, end, timezone) => {

    const startDate = luxon.DateTime.fromMillis(start).setZone(timezone).toMillis();
    const endDate = luxon.DateTime.fromMillis(end).setZone(timezone).toMillis();

    return {
        startDate: startDate,
        endDate: endDate,
    }

}

classCategorySessionService.generateSessionsByCity = async (cityId, start, end, schedules) => {

    const timezone = await cityService.getTimezoneFromCityId(cityId);
    const startEndWithTimezone = classCategorySessionService.convertStartEndToTimezone(start, end, timezone);
    const now = luxon.DateTime.now().setZone(timezone).toMillis();

    const sessions = [];
    for (let i=0;i<schedules.length;i++) {

        let session = classCategorySessionService.convertStartEndToTimezone(schedules[i].start, schedules[i].end, timezone)

        if (schedules[i].isWeekly) {
            
            while (session.startDate < startEndWithTimezone.endDate) {
                if (session.startDate < startEndWithTimezone.endDate && session.endDate < startEndWithTimezone.endDate &&
                    session.startDate > startEndWithTimezone.startDate && session.endDate > startEndWithTimezone.startDate && 
                    session.startDate > now) {
                    sessions.push({
                        startDate: session.startDate,
                        endDate: session.endDate,
                    });
                }
                session.startDate += 7 * 24 * 60 * 60 * 1000;
                session.endDate += 7 * 24 * 60 * 60 * 1000;
            }

        } else {
            sessions.push(session);
        }

    }
    return sessions;

};

module.exports = classCategorySessionService;