import { Router } from 'express'
import taskRoutes from './task/task.routes'
import authRoutes from './auth/auth.routes'
import userRoutes from './user/user.routes'

const routes = Router()

routes.use('/task', taskRoutes)
routes.use('/auth', authRoutes)
routes.use('/user', userRoutes)

export default routes