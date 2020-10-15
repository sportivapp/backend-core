const TeamSportTypeRole = require('../models/TeamSportTypeRole')

const teamSportTypeRoleService = {}

teamSportTypeRoleService.insertTeamSportTypeRoles = async (teamUserMappingId, teamId, sportRoleIds, user) => {

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

teamSportTypeRoleService.deleteAllTeamSportTypeRolesByTeamId = async (teamId) => {

    return TeamSportTypeRole.query()
    .where('eteameteamid', teamId)
    .delete()

}

module.exports = teamSportTypeRoleService