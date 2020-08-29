const ResponseHelper = require('../../helper/ResponseHelper')
const TodolistService = require('../../services/todoListService')

const controller = {}

controller.createTodoList = async (req, res, next) => {}

controller.updateTodoById = async (req, res, next) => {

    const { todoId } = req.params
    const { name, startTime, endTime, description, address, userIds } = req.body

    const dto = {
        etodoname: name,
        etodostarttime: startTime,
        etodoendtime: endTime,
        etododescription: description,
        etodoaddress: address
    }

    try {
        const result = await TodolistService.updateTodoById(todoId, dto, userIds, req.user)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }}

controller.deleteTodoById = async (req, res, next) => {

    const { todoId } = req.params

    try {
        const result = await TodolistService.deleteTodoById(todoId, req.user)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getTodoListByCategoryId = async (req, res, next) => {

    const { page, size, categoryId } = req.query

    try {
        const result = await TodolistService.getTodoListByCategory(categoryId, parseInt(page), parseInt(size), req.user)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toPageResponse(result.data, result.paging))
    } catch (e) {
        next(e)
    }
}

controller.getTodoListCategories = async (req, res, next) => {

    try {
        const result = await TodolistService.getTodoListCategories(req.user)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getTodoById = async (req, res, next) => {

    const { todoId } = req.params

    try {
        const result = await TodolistService.getTodoById(todoId, req.user)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = controller