const theoryService = require('../../services/theoryService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.createTheory = async (req, res, next) => {

    // inserted in postman's form-data because of req.file, so companyId should be parseed to integer
    const { companyId } = req.body

    // insert permission here?
    
    try {

        const result = await theoryService.createTheory(parseInt(companyId), req.file, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

controller.getTheoryList = async (req, res, next) => {

    const { keyword = '', companyId = null, page = '0', size = '100' } = req.query
    
    try {

        const pageObj = await theoryService.getTheoryList(keyword, parseInt(page), parseInt(size), parseInt(companyId), req.user);
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch(e) {
        next(e);
    }

}

controller.previewTheory = async (req, res, next) => {

    const { fileId, companyId } = req.body;

    // inser permission here?

    try {
        const result = await theoryService.previewTheory(fileId, companyId, req.user)
        return res.status(200).sendFile(result.efilepath);        
    } catch(e) {
        next(e);
    }

}

controller.downloadTheory = async (req, res, next) => {

    const { fileId, companyId } = req.body

    // insert permission here?

    try {

        const result = await theoryService.downloadTheory(fileId, companyId, req.user)
        return res.download(result.efilepath)
        
    } catch (e) {
        next(e)
    }

}

controller.deleteTheoryByFileId = async (req, res, next) => {

    const { fileId, companyId } = req.body

    // insert permission here?
    
    try {

        const result = await theoryService.deleteTheoryByFileId(fileId, companyId, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

module.exports = controller;