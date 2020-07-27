const Roster = require('../models/Roster');
const RosterUserMapping = require('../models/RosterUserMapping');

RosterService = {};

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

RosterService.updateRosterById = async ( rosterId, rosterDTO ) => {

    const updateRoster = await Roster.query().select().where('erosterid', rosterId).update(rosterDTO);

    return updateRoster;
}

RosterService.updateMemberByRosterId = async ( rosterId, userIds ) => {
    // delete member that's in the roster
    await RosterUserMapping.query().delete().where('erostererosterid', rosterId);
    // Insert the updated member
    const updatedMember = await RosterService.addMember(rosterId, userIds);

    return updatedMember;
}

RosterService.deleteRosterById = async ( rosterId ) => {
    // delete member that's in the roster
    await RosterUserMapping.query().delete().where('erostererosterid', rosterId);

    const deletedRoster = await Roster.query().delete().where('erosterid', rosterId);

    return deletedRoster;
}

module.exports = RosterService;