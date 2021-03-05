const ModuleNameEnum = require('../../models/enum/ModuleNameEnum')
const settingService = require('../settingService')
const profileService = require('../profileService')
const { NotFoundError } = require('../../models/errors')

const permissionService = {};

permissionService.getPermissionsByModuleName = async (moduleName, user) => {

    if (!ModuleNameEnum[moduleName.toUpperCase()])
        throw new NotFoundError();

    return settingService.getModuleByName(ModuleNameEnum[moduleName.toUpperCase()])
        .then(module => module.emoduleid)
        .then(moduleId => profileService.getFunctionsByModuleId(moduleId, user))
        .catch(() => {
            throw new NotFoundError();
        });
}

module.exports = permissionService;