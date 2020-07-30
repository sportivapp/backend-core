const Roster = require('../models/Roster');
const RosterUserMapping = require('../models/RosterUserMapping');

const RosterService = {};

RosterService.createRoster = async ( rosterDTO, userIds ) => {
    const newRoster = await Roster.query().insert(rosterDTO);

    await RosterService.addMember(newRoster.erosterid, userIds )

    return newRoster;
}

RosterService.addMember = async ( rosterId, userIds ) => {
    const members = userIds.map(user => 
        ({ 
            erostererosterid: rosterId,
            eusereuserid: user
        }));  

    const insertedMembers = await RosterUserMapping.query().insert(members);

    return insertedMembers;
}

RosterService.getAllRosters = async () => {
    const rosters = await Roster.query().select();

    return rosters;
}

RosterService.getAllMemberById = async ( rosterId ) => {
    const members = await RosterUserMapping.query().select().where('erostererosterid', rosterId);

    return members;
}

RosterService.viewRosterById = async ( rosterId ) => {
    const roster = await Roster.query().select().where('erosterid', rosterId).first();

    return roster;
}

RosterService.updateRosterById = async ( rosterId, rosterDTO, userIds ) => {
    // delete member that's in the roster
    await RosterUserMapping.query().delete().where('erostererosterid', rosterId);

    const updateRoster = await Roster.query().select().where('erosterid', rosterId).update(rosterDTO);

    // Insert the updated member
    await RosterService.addMember(rosterId, userIds);

    return updateRoster;
}

RosterService.deleteRosterById = async ( rosterId ) => {
    // delete member that's in the roster
    await RosterUserMapping.query().delete().where('erostererosterid', rosterId);

    const deletedRoster = await Roster.query().delete().where('erosterid', rosterId);

    return deletedRoster;
}

RosterService.generateRosterShiftForDate = async (hourType, formation, rosterId, date) => {

    const roster = await Roster.query().select('eproject.eprojectstartdate')
    .join('eproject', 'eroster.eprojecteprojectid', 'eproject.eprojectid').where('erosterid', rosterId).first();

    // const start = roster.eprojectstartdate; => 2020-07-24 becomes 2020-07-23...
    const start = '2020-07-01';
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