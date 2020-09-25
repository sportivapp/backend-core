const experienceService = require('../../services/experienceService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getExperienceById = async (req, res, next) => {

    const { experienceId } = req.params
    const { userId, companyId } = req.body
    
    try {

        const result = await experienceService.getExperienceById(parseInt(experienceId), userId, companyId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e)
    }

}

module.exports = controller
