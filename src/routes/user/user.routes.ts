import { Router } from 'express'
import authMiddleware from '../../middlewares/auth.middleware'
import UserController from '../../controllers/user/user.controller'

const userRoutes = Router()

userRoutes.get('/telephone', authMiddleware, UserController.get)
userRoutes.post('/telephone', authMiddleware, UserController.registerPhone)
userRoutes.put('/telephone/:id', authMiddleware, UserController.updatePhone)
userRoutes.delete('/telephone/:id', authMiddleware, UserController.deletePhone)

export default userRoutes