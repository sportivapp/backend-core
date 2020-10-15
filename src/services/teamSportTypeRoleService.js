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

module.exports = teamSportTypeRoleService