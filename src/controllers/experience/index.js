const experienceService = require('../../services/experienceService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getExperienceById = async (req, res, next) => {

    const { experienceId } = req.params
    
    try {

        const result = await experienceService.getExperienceById(experienceId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e)
    }

}

module.exports = controller
