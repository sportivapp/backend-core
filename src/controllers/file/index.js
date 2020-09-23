const fileService = require('../../services/fileService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.createFile = async (req, res, next) => {

    try {
        const result = await fileService.createFile(req.file, req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

controller.createMultipleFiles = async (req, res, next) => {

    try {
        const result = await fileService.createMultipleFiles(req.files, req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

controller.previewFile = async (req, res, next) => {

    const { fileId } = req.params;

    try {
        const result = await fileService.getFileById(fileId);
        
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).sendFile(result.efilepath);        
    } catch(e) {
        next(e);
    }

}

controller.previewFileRestricted = async (req, res, next) => {

    const { fileId } = req.params;

    try {
        const result = await fileService.getFileByIdAndCreateBy(fileId, req.user.sub);
        
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).sendFile(result.efilepath);        
    } catch(e) {
        next(e);
    }

}

controller.getFile = async (req, res, next) => {

    const { fileId } = req.params;

    try {
        const result = await fileService.getFileById(fileId);
        
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result)); 
    } catch(e) {
        next(e);
    }

}

module.exports = controller;