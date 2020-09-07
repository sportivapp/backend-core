const Todo = require('../models/Todo')
const TodoUser = require('../models/TodoUser')
const TodoListCategory = require('../models/TodoListCategory')
const Project = require('../models/Project')
const ServiceHelper = require('../helper/ServiceHelper')
const TodoUserStatusEnum = require('../models/enum/TodoUserStatusEnum')

const service = {}

service.createTodoListByProject = async (projectId, shiftRosterUserMappings, user) => {
    const project = await Project.query().findById(projectId)
    const promises = shiftRosterUserMappings.map(mapping => {
        const todoDTO = {
            eprojecteprojectid: project.eprojectid,
            etodoname: project.eprojectname,
            etododescription: project.eprojectdescription,
            eshifttimeeshifttimeid: mapping.eshifttimeeshifttimeid,
        }
        return service.createTodo(todoDTO, user)
            .then(todo => service.createTodoListCategoryByProject(project, mapping.eusereuserid, user)
                    .then(category => [todo, category.etodolistcategoryid]))
            .then(todoAndCategoryId => service.createTodoUser(todoAndCategoryId[0], mapping.eusereuserid, todoAndCategoryId[1], user))
    })

    return Promise.all(promises)
}

service.createTodoList = async (dto, userIds, categoryId, user) => {

    const todo = await Todo.query().insertToTable(dto, user.sub)

    const promises = userIds.map(userId => {
        if (userId === user.sub) return service.createTodoUser(todo, userId, categoryId, user)
        return service.createTodoUser(todo, userId, undefined, user)
    })
    return Promise.all(promises)
}

service.createTodo = async (todoDTO, user) => {
    return Todo.query().insertToTable(todoDTO, user.sub)
}

service.createTodoUser = async (todo, userId, categoryId, user) => {
    const dto = {
        etodoetodoid: todo.etodoid,
        eusereuserid: userId,
        etodouserstatus: TodoUserStatusEnum.PENDING,
        etodolistcategoryetodolistcategoryid: categoryId
    }
    return TodoUser.query().insertToTable(dto, user.sub)
}

service.createTodoListCategoryByProject = async (project, userId, user) => {
    const dto = {
        etodolistcategoryname: project.eprojectname,
        eusereuserid: userId
    }
    return TodoListCategory.query().insertToTable(dto, user.sub)
}

service.createTodoListCategory = async (categoryName, user) => {
    const dto = {
        etodolistcategoryname: categoryName,
        eusereuserid: user.sub
    }
    return TodoListCategory.query().insertToTable(dto, user.sub)
}

service.updateTodoById = async (todoId, todoDTO, userIds, user) => {
    const todo = await Todo.query().findById(todoId)

    const savedUserIds = await TodoUser.query()
        .where('etodoetodoid', todo.etodoid)
        .then(todoUserList => todoUserList.map(todoUser => todoUser.eusereuserid))

    if (todo.etodocreateby !== user.sub) return

    todo.$query().updateByUserId(todoDTO, user.sub).returning('*')
}

service.updateTodoUserStatusByTodoId = async (todoId, status, user) => {
    const todo = await Todo.query().findById(todoId)
    if (!todo) return
    if (!TodoUserStatusEnum.hasOwnProperty(status)) return
    return TodoUser.query()
        .where('etodoetodoid', todoId)
        .andWhere('eusereuserid', user.sub)
        .first()
        .updateByUserId({ etodouserstatus: status }, user.sub)
        .returning('*')
}

service.deleteTodoById = async (todoId, user) => {
    const todo = Todo.query().findById(todoId)
    if (!todo || todo.eprojecteprojectid || todo.etodocreateby !== user.sub) return false
    return todo.$query().delete().then(rowsAffected => rowsAffected === 1)
}

service.getTodoListByCategory = async (categoryId, page, size, user) => {
    if (!categoryId) categoryId = null
    return TodoUser.query().where('eusereuserid', user.sub)
        .andWhere('etodolistcategoryetodolistcategoryid', categoryId)
        .withGraphFetched('todo.[project(baseAttributes), creator(baseAttributes)]')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

service.getTodoById = async (todoId, user) => {
    return TodoUser.query()
        .where('etodoetodoid', todoId)
        .where('eusereuserid', user.sub)
        .withGraphFetched('todo.[project(baseAttributes), time(baseAttributes)]')
        .first()
        .then(todoUser => todoUser.todo)
}

service.getTodoListCategories = async (user) => {
    return TodoListCategory.query().where('eusereuserid', user.sub)
}

module.exports = service