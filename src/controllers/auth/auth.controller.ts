import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../../models/user.entity'
import Token from '../../models/token.entity'

export default class AuthController {
    static async store(req: Request, res: Response) {
        const { name, email, password } = req.body

        if (!name) return res.status(400).json({ error: "Nome obrigatório" })
        if (!email) return res.status(400).json({ error: "Email obrigatório" })
        if (!password) return res.status(400).json({ error: "Senha obrigatório" })

        const user = new User()
        user.name = name
        user.email = email
        user.password = bcrypt.hashSync(password, 10)
        await user.save()

        return res.json({
            id: user.id,
            name: user.name,
            email: user.email
        })
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body

        if (!email || !password) return res.status(400).json({ error: "Email e senha são obrigatórios" })

        const user = await User.findOneBy({ email })
        if (!user) return res.status(401).json({ error: "Usuário ou senha inválida" })

        const passwCheck = await bcrypt.compareSync(password, user.password)
        if (!passwCheck) return res.status(401).json({ error: "Usuário ou senha inválida" })

        await Token.delete({ user: { id: user.id } })

        const token = new Token()
        //let numberRand = Math.random()
        //numberRand *= user.id 
        //const stringRand = numberRand.toString(36)
        const stringRand = user.id + new Date().toString()
        token.token = bcrypt.hashSync(stringRand, 1).slice(-20)
        token.expiresAt = new Date(Date.now() + 60 * 60 * 1000)
        token.refreshToken = bcrypt.hashSync(stringRand + 2, 1).slice(-20)

        token.user = user
        await token.save()

        res.cookie('token', token.token, { httpOnly: true, secure: true, sameSite: 'none' });
        return res.json({
            name: token.user.name,
            email: email,
            token: token.token,
            expiresAt: token.expiresAt,
            refreshToken: token.refreshToken
        })
    }

    static async refresh(req: Request, res: Response) {
        const { token } = req.cookies

        if (!token) return res.status(400).json({ error: 'O refresh token é obrigatório' })

        const authorization = await Token.findOneBy({ refreshToken: token })
        if (!authorization) return res.status(401).json({ error: 'Refresh token inválido' })

        if (authorization.expiresAt < new Date()) {
            await token.remove()
            return res.status(401).json({ error: 'Refresh token expirado' })
        }

        authorization.token = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
        authorization.refreshToken = bcrypt.hashSync(Math.random().toString(36), 1).slice(-20)
        authorization.expiresAt = new Date(Date.now() + 60 * 60 * 1000)
        authorization.userId;

        await authorization.save()

        res.cookie('token', authorization.token, { httpOnly: true, secure: true, sameSite: 'none' })
        return res.json({
            token: authorization.token,
            expiresAt: authorization.expiresAt,
            refreshToken: authorization.refreshToken
        })
    }

    static async logout(req: Request, res: Response) {
        const { token } = req.cookies

        if (!token) return res.status(400).json({ error: 'O token é obrigatório' })

        const userToken = await Token.findOneBy({ token: token })
        if (!userToken) return res.status(401).json({ error: 'Token inválido' })

        await userToken.remove()

        res.clearCookie('token')

        return res.status(204).json()
    }

    static async verify(req: Request, res: Response) {
        const { token } = req.cookies

        if (!token) return res.status(400).json({ error: 'O token é obrigatório' })

        const userToken = await Token.findOneBy({ token: token })
        if (!userToken) return res.status(401).json({ error: 'Token inválido' })

        if (userToken.expiresAt < new Date()) {
            await token.remove()
            return res.status(401).json({ error: 'Token expirado' })
        }


        return res.status(200).json()
    }
}