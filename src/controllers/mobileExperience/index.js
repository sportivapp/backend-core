const mobileExperienceService = require('../../services/mobileExperienceService');
const ResponseHelper = require('../../helper/ResponseHelper');

const experienceController = {};

experienceController.createExperience = async (req, res, next) => {

    const request = req.body

    try {

        const experienceDTO = {
            eexperiencename: request.name,
            eexperiencestartdate: request.startDate,
            eexperienceenddate: request.endDate === 0 ? null : request.endDate,
            eexperiencelocation: request.location,
            eexperienceposition: request.position,
            eexperiencedescription: request.description,
            eindustryeindustryid: request.industryId,
            eusereuserid: req.user.sub
        }

        experienceDTO.eexperienceenddate = experienceDTO.eexperienceenddate === 0 ? null : request.endDate

        const fileId = req.body.fileId === undefined ? 0 : req.body.fileId;
        const result = await mobileExperienceService.createExperience(experienceDTO, req.user, fileId)

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e)
    }

}

experienceController.editExperience = async (req, res, next) => {

    const { experienceId } = req.params
    
    const request = req.body

    let fileId = request.fileId

    try {

        const experienceDTO = {
            eexperiencename: request.name,
            eexperiencestartdate: request.startDate,
            eexperienceenddate: request.endDate,
            eexperiencelocation: request.location,
            eexperienceposition: request.position,
            eexperiencedescription: request.description,
            eindustryeindustryid: request.industryId
        }

        experienceDTO.eexperienceenddate = experienceDTO.eexperienceenddate === 0 ? null : request.endDate
        fileId = fileId === undefined ? 0 : req.body.fileId

        const result = await mobileExperienceService.editExperience(experienceDTO, parseInt(experienceId), req.user, fileId)

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e)
    }

}

experienceController.getExperienceList = async (req, res, next) => {

    const { page, size, keyword } = req.query
    
    try {

        const pageObj = await mobileExperienceService.getExperienceList(parseInt(page), parseInt(size), req.user,keyword)

        if(!pageObj)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e)
    }

}

experienceController.getExperienceById = async (req, res, next) => {

    const { experienceId } = req.params
    
    try {

        const result = await mobileExperienceService.getExperienceById(experienceId)

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e)
    }

}

experienceController.deleteExperience = async (req, res, next) => {

    const { experienceId } = req.params
    
    try {

        const result = await mobileExperienceService.deleteExperience(experienceId, req.user)

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e)
    }

}

module.exports = experienceController