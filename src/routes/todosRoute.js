import { Router } from "express";
import TodosController from "../controllers/todosController.js";
import Auth from "../auth/auth.route.js"

const router = Router()

router.use(Auth.authenticate())

router.route('/').get(TodosController.getAllTodos).post(TodosController.createTodo)
router.route('/:id').patch(TodosController.updateTodo).delete(TodosController.deleteTodo)

export default router
