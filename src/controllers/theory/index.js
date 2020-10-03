const theoryService = require('../../services/theoryService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.createTheory = async (req, res, next) => {

    // insert permission here?
    
    try {

        const result = await theoryService.createTheory(req.file, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

controller.getTheoryList = async (req, res, next) => {

    const { keyword = '', page = '0', size = '10' } = req.query
    
    try {

        const pageObj = await theoryService.getTheoryList(keyword, parseInt(page), parseInt(size), req.user);
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }

}

controller.previewTheory = async (req, res, next) => {

    const { theoryId } = req.params

    // inser permission here?

    try {
        const result = await theoryService.previewTheory(parseInt(theoryId), req.user)
        return res.status(200).sendFile(result.efilepath);        
    } catch(e) {
        next(e);
    }

}

controller.downloadTheory = async (req, res, next) => {

    const { theoryId } = req.params

    // insert permission here?

    try {

        const result = await theoryService.downloadTheory(parseInt(theoryId), req.user)
        return res.download(result.efilepath)
        
    } catch (e) {
        next(e)
    }

}

controller.deleteTheoryByFileId = async (req, res, next) => {

    const { theoryId } = req.params

    // insert permission here?
    
    try {

        const result = await theoryService.deleteTheoryByFileId(parseInt(theoryId), req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

module.exports = controller;