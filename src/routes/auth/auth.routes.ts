import { Router } from 'express'
import AuthController from '../../controllers/auth/auth.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const authRoutes = Router()

authRoutes.post('/register', AuthController.store)
authRoutes.post('/login', AuthController.login)
authRoutes.get('/logout', AuthController.logout)
authRoutes.get('/verify', AuthController.verify)

export default authRoutes