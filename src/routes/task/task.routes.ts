import { Router } from 'express'
import TaskController from '../../controllers/task/task.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const taskRoutes = Router()

taskRoutes.post('/', authMiddleware, TaskController.create)
taskRoutes.get('/', authMiddleware, TaskController.get)
taskRoutes.get('/:id', authMiddleware, TaskController.search)
taskRoutes.delete('/:id', authMiddleware, TaskController.delete)
taskRoutes.put('/:id', authMiddleware, TaskController.update)

export default taskRoutes