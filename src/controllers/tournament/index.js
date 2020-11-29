const ResponseHelper = require('../../helper/ResponseHelper')
const tournamentService = require('../../services/tournamentService')

const tournamentController = {}

tournamentController.getAllCompaniesByCreatePermission = async (req, res, next) => {

    try {
        const result = await tournamentService.getAllCompaniesByCreatePermission(req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = tournamentController