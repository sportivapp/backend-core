const TeamSportTypeRole = require('../models/TeamSportTypeRole')

const mobileTeamSportTypeRoleService = {}

mobileTeamSportTypeRoleService.insertTeamSportTypeRoles = async (teamUserMappingId, teamId, sportRoleIds, user) => {

    return TeamSportTypeRole.transaction(async trx => {

        await TeamSportTypeRole.query(trx)
        .where('eteamusermappingeteamusermappingid', teamUserMappingId)
        .delete()

        if (sportRoleIds !== null) {

            const mappings = sportRoleIds.map(sportRoleId => ({
                eteamusermappingeteamusermappingid: teamUserMappingId,
                esporttyperoleesporttyperoleid: sportRoleId,
                eteameteamid: teamId
            }))

            return TeamSportTypeRole.query(trx)
            .insertToTable(mappings, user.sub)

        }

        return true

    })
    

}

mobileTeamSportTypeRoleService.deleteAllTeamSportTypeRolesByTeamId = async (teamId) => {

    return TeamSportTypeRole.query()
    .where('eteameteamid', teamId)
    .delete()

}

module.exports = mobileTeamSportTypeRoleService