const Roster = require('../models/Roster');
const RosterUserMapping = require('../models/RosterUserMapping');
const ServiceHelper = require('../helper/ServiceHelper')
const { types } = require('pg');

const RosterService = {};

RosterService.createRoster = async ( rosterDTO, userIds, user ) => {

    if (user.permission !== 8 && user.permission !== 10) return

    const result = await Roster.query().insert(rosterDTO);

    await RosterService.addMember(result.erosterid, userIds )

    return result;
}

RosterService.addMember = async ( rosterId, userIds ) => {
    const members = userIds.map(user => 
        ({ 
            erostererosterid: rosterId,
            eusereuserid: user
        }));  

    const result = await RosterUserMapping.query().insert(members);

    return result;
}

RosterService.getAllRosters = async ( page, size, user ) => {

    if (user.permission !== 8 && user.permission !== 10) return

    const rosterPage = await Roster.query().select().page(page, size);

    return ServiceHelper.toPageObj(page, size, rosterPage);

}

RosterService.getAllMemberById = async ( page, size, rosterId, user ) => {

    if (user.permission !== 7 && user.permission !== 8 && user.permission !== 10) return

    const membersPage = await RosterUserMapping.query().select().where('erostererosterid', rosterId).page(page, size);

    return ServiceHelper.toPageObj(page, size, membersPage);
}

RosterService.viewRosterById = async (rosterId, user ) => {

    if (user.permission !== 8 && user.permission !== 10) return

    const result = await Roster.query().select().where('erosterid', rosterId).first();

    return result;
}

RosterService.updateRosterById = async ( rosterId, rosterDTO, userIds, user ) => {

    if (user.permission !== 8 && user.permission !== 10) return

    // delete member that's in the roster
    await RosterUserMapping.query().delete().where('erostererosterid', rosterId);

    const result = await Roster.query().select().where('erosterid', rosterId).update(rosterDTO);

    // Insert the updated member
    await RosterService.addMember(rosterId, userIds);

    return result;
}

RosterService.deleteRosterById = async ( rosterId, user ) => {

    if (user.permission !== 8 && user.permission !== 10) return

    const result = await Roster.query().delete().where('erosterid', rosterId);

    return result;
}

RosterService.generateRosterShiftForDate = async (hourType, formation, rosterId, date) => {

    // return date as is
    types.setTypeParser(1082, value => value);

    const roster = await Roster.query().select('eproject.eprojectstartdate')
    .join('eproject', 'eroster.eprojecteprojectid', 'eproject.eprojectid').where('erosterid', rosterId).first();

    const start = roster.eprojectstartdate;
    const shifts = await RosterService.getRosterShiftsByDate(hourType, formation, start, date);

    return shifts;

}

RosterService.getRosterShiftsByDate = async (hourType, formation, start, currentDate) => {

    const currentDateDate = new Date(currentDate);
    const startDate = new Date(start);
    const mils = currentDateDate.getTime() - startDate.getTime();
    // Days difference ex: start 2020-07-01, current 2020-07-29 => 28
    const days = mils / (1000*3600*24);

    let startingShift = [];
    let patterns = [];
    
    if (hourType === '8') {
        if (formation === '5-2/6-1') {
            startingShift = [0, 5, 3, 8];
            firstPattern = ['D', 'D', 'AN', 'AN', 'N', 'N', 'O', 'D', 'D', 'AN', 'AN', 'N', 'O', 'O'];
            secondPattern = ['D', 'D', 'AN', 'AN', 'N', 'O', 'O'];
            thirdPattern = ['D', 'D', 'AN', 'N', 'N', 'O', 'O'];
            fourthPattern = ['D', 'AN', 'AN', 'N', 'N', 'O', 'D', 'D', 'AN', 'AN', 'N', 'N', 'O', 'O'];
            patterns.push(firstPattern);
            patterns.push(secondPattern);
            patterns.push(thirdPattern);
            patterns.push(fourthPattern);
        }
    }

    // Do the calculation
    let result = [];
    let index = 0;

    for (let i=0;i<startingShift.length; i++) {

        if (startingShift.length !== patterns.length) {
            index = 0;
        } else {
            index += 1;
        }

        if (i === 0) {
            index = 0;
        }

        const startingShiftIndex = startingShift[i];
        const scheduleIndex = (days + startingShiftIndex) % patterns[index].length;
        result.push(patterns[index][scheduleIndex]);

    }

    return result;

}

module.exports = RosterService;