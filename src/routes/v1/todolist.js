const router = require('../router')
const todoListService = require('../../controllers/todoList');
const auth = require('../../middlewares/authentication');
const { routes } = require('../../constant')

// router.post( routes.todolist.list, auth.authenticateToken, todoListService.createTodoList);
router.get( routes.todolist.list, auth.authenticateToken, todoListService.getTodoListByCategoryId);
router.get( routes.todolist.id, auth.authenticateToken, todoListService.getTodoById);
router.put( routes.todolist.id, auth.authenticateToken, todoListService.updateTodoById)
router.delete( routes.todolist.id, auth.authenticateToken, todoListService.deleteTodoById);
router.get( routes.todolist.category, auth.authenticateToken, todoListService.getTodoListCategories);

module.exports = router.expressRouter;