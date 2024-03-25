import { Request, Response } from 'express';
import Telephone from '../../models/telephone.entity';
import User from '../../models/user.entity';

export default class UserController {
    static async get(req: Request, res: Response){
        const { userId } = req.headers

        if(!userId) return res.status(401).json({ error: 'Usuário não autenticado' })

        const telephone = await Telephone.find({where: { userId: Number(userId) }})
        const user = await User.findOneBy({ id: Number(userId) })

        if(!telephone || !user) return res.status(400)

        return res.status(201).json({ user: { name: user.name, email: user.email }, telephone })
    }

    static async registerPhone(req: Request, res: Response){
        const { number } = req.body
        const { userId } = req.headers

        if(!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
        if(!number || isNaN(Number(number))) return res.status(400).json({ error: 'O número é obrigatório' })

        const oldTel = await Telephone.findOneBy({ number: Number(number), userId: Number(userId) })

        if(oldTel) return res.status(400).json({ error: 'Esse número já está cadastrado' })

        const telephone = new Telephone()
        telephone.number = Number(number)
        telephone.userId = Number(userId)
        await telephone.save()

        return res.status(201).json({ id: telephone.id, number: telephone.number })
    }

    static async deletePhone(req: Request, res: Response){
        const { id } = req.params
        const { userId } = req.headers

        if(!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
        if(!id || isNaN(Number(id))) return res.status(400).json({error: 'O id é obrigatório!'});

        const telephone = await Telephone.findOneBy({ id: Number(id), userId: Number(userId) })

        if(!telephone) return res.status(404).json({ error: 'Telefone não encontrado' });

        telephone.remove()
        return res.status(204).send()
    }

    static async updatePhone(req: Request, res: Response){
        const { id } = req.params
        const { userId } = req.headers
        const { number } = req.body

        if(!userId) return res.status(401).json({ error: 'Usuário não autenticado' })
        if(!id || isNaN(Number(id))) return res.status(400).json({error: 'O id é obrigatório!'});
        if(!number) return res.status(400).json({ error: 'Um novo número é obrigatório' })

        const telephone = await Telephone.findOneBy({ id: Number(id), userId: Number(userId)})

        if(!telephone) return res.status(400).json({ error: 'Telefone não encontrado' })

        telephone.number = number ?? telephone.number
        telephone.save()

        return res.json(telephone)
    }
}