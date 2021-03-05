const permissionService = require('../../services/landing/permissionService');
const ResponseHelper = require('../../helper/ResponseHelper');

const permissionController = {};

permissionController.getPermissionsByModuleName = async (req, res, next) => {

    const { moduleName } = req.params;
    const user = req.user;

    try {

        const result = await permissionService.getPermissionsByModuleName(moduleName, user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = permissionController;