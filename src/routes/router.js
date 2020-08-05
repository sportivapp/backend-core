const express = require('express');
const router = express.Router();
const validator = require('../middlewares/web-validation')

const newRouter = {}

newRouter.get = (path, middlewares, callback) => {
    return router.get(path, middlewares, callback)
}

newRouter.post = (path, middlewares, callback) => {
    return router.post(path, [middlewares, validator], callback)
}

newRouter.put = (path, middlewares, callback) => {
    return router.put(path, [middlewares, validator], callback)
}

newRouter.delete = (path, middlewares, callback) => {
    return router.delete(path, middlewares, callback)
}

newRouter.expressRouter = router

module.exports = newRouter