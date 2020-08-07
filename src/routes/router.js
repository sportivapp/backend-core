const express = require('express');
const router = express.Router();
const validator = require('../middlewares/web-validation')

const newRouter = {}

newRouter.get = (path, ...callbacks) => {
    if (callbacks.length === 1) return router.get(path, validator, callbacks[0])
    return router.get(path, callbacks.slice(0, callbacks.length - 1), callbacks[callbacks.length - 1])
}

newRouter.post = (path, ...callbacks) => {
    if (callbacks.length === 1) return router.post(path, validator, callbacks[0])
    return router.post(path, [callbacks.slice(0, callbacks.length - 1), validator], callbacks[callbacks.length - 1])
}

newRouter.put = (path, ...callbacks) => {
    if (callbacks.length === 1) return router.put(path, validator, callbacks[0])
    return router.put(path, [callbacks.slice(0, callbacks.length - 1), validator], callbacks[callbacks.length - 1])
}

newRouter.delete = (path, ...callbacks) => {
    if (callbacks.length === 1) return router.delete(path, validator, callbacks[0])
    return router.delete(path, callbacks.slice(0, callbacks.length - 1), callbacks[callbacks.length - 1])
}

newRouter.expressRouter = router

module.exports = newRouter