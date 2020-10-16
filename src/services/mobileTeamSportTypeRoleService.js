const TeamSportTypeRole = require('../models/TeamSportTypeRole')

const mobileTeamSportTypeRoleService = {}

mobileTeamSportTypeRoleService.insertTeamSportTypeRoles = async (teamUserMappingId, teamId, sportRoleIds, user) => {

    await TeamSportTypeRole.query()
    .where('eteamusermappingeteamusermappingid', teamUserMappingId)
    .delete()

    const mappings = sportRoleIds.map(sportRoleId => ({
        eteamusermappingeteamusermappingid: teamUserMappingId,
        esporttyperoleesporttyperoleid: sportRoleId,
        eteameteamid: teamId
    }))

    return TeamSportTypeRole.query()
    .insertToTable(mappings, user.sub)

}

mobileTeamSportTypeRoleService.deleteAllTeamSportTypeRolesByTeamId = async (teamId) => {

    return TeamSportTypeRole.query()
    .where('eteameteamid', teamId)
    .delete()

}

module.exports = mobileTeamSportTypeRoleService