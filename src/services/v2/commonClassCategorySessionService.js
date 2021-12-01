const cityService = require('../cityService');
const luxon = require('luxon');

const classCategorySessionService = {};

classCategorySessionService.convertStartEndToTimezone = (start, end, timezone) => {

    const offset = luxon.DateTime.fromMillis(start).setZone(timezone).offset;
    const startDate = new Date(start - (60000 * offset)).getTime();
    const endDate = new Date(end - (60000 * offset)).getTime();

    return {
        startDate: startDate,
        endDate: endDate,
    }

}

classCategorySessionService.generateSessionsByCity = async (cityId, start, end, schedules) => {

    // const timezone = await cityService.getTimezoneFromCityId(cityId);
    const timezone = 'Asia/Jakarta';
    // const startEndWithTimezone = classCategorySessionService.convertStartEndToTimezone(start, end, timezone);
    const startEndWithTimezone = {
        startDate: start,
        endDate: end,
    }
    const now = luxon.DateTime.now().setZone(timezone).toMillis();

    const sessions = [];
    for (let i=0;i<schedules.length;i++) {

        // let session = classCategorySessionService.convertStartEndToTimezone(schedules[i].start, schedules[i].end, timezone)
        let session = {
            startDate: schedules[i].start,
            endDate: schedules[i].end,
        }

        if (schedules[i].isWeekly) {
            
            while (session.startDate < startEndWithTimezone.endDate) {
                if (session.startDate < startEndWithTimezone.endDate && session.endDate < startEndWithTimezone.endDate &&
                    session.startDate > startEndWithTimezone.startDate && session.endDate > startEndWithTimezone.startDate && 
                    session.startDate > now) {
                    sessions.push({
                        startDate: session.startDate,
                        endDate: session.endDate,
                        price: schedules[i].price,
                    });
                }
                session.startDate += 7 * 24 * 60 * 60 * 1000;
                session.endDate += 7 * 24 * 60 * 60 * 1000;
            }

        } else {
            session.price = schedules[i].price;
            sessions.push(session);
        }

    }
    return sessions;

};

module.exports = classCategorySessionService;