const express = require('express');
const router = express.Router();
const validator = require('../../middlewares/web-validation')

const newRouter = {}

const BASE_URL = '/common'

newRouter.get = (path, ...callbacks) => {
    if (callbacks.length === 1) return router.get(BASE_URL.concat(path), validator, callbacks[0])
    return router.get(BASE_URL.concat(path), callbacks.slice(0, callbacks.length - 1), callbacks[callbacks.length - 1])
}

newRouter.post = (path, ...callbacks) => {
    if (callbacks.length === 1) return router.post(BASE_URL.concat(path), validator, callbacks[0])
    return router.post(BASE_URL.concat(path), [callbacks.slice(0, callbacks.length - 1), validator], callbacks[callbacks.length - 1])
}

newRouter.put = (path, ...callbacks) => {
    if (callbacks.length === 1) return router.put(BASE_URL.concat(path), validator, callbacks[0])
    return router.put(BASE_URL.concat(path), [callbacks.slice(0, callbacks.length - 1), validator], callbacks[callbacks.length - 1])
}

newRouter.delete = (path, ...callbacks) => {
    if (callbacks.length === 1) return router.delete(BASE_URL.concat(path), validator, callbacks[0])
    return router.delete(BASE_URL.concat(path), callbacks.slice(0, callbacks.length - 1), callbacks[callbacks.length - 1])
}

newRouter.expressRouter = router

module.exports = newRouter