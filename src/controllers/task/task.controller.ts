import { Request, Response } from 'express';
import Task from '../../models/task.entity';

export default class TaskController {
    static async create(req: Request, res: Response){
        const {title, completed} = req.body;

        if(!title){
            return res.status(400).json({ erro: 'Título é obrigatório!' })
        }
        

        const task = new Task();
        task.title = title;
        task.completed = completed ?? false;
        await task.save();

        return res.status(201).json(task);
    }

    static async get(req: Request, res: Response){
        const tasks = await Task.find();
        return res.status(200).json(tasks);
    }

    static async search(req: Request, res: Response){
        const { id } = req.params; //const id = req.params.id

        if(!id || isNaN(Number(id))){
            return res.status(400).json({ erro: 'O id é obrigatório' });
        }

        const task = await Task.findOneBy({ id: Number(id) });

        if(!task){
            return res.status(404).json({ erro: 'Não encontrado' });
        }

        return res.json(task);
    }

    static async delete(req: Request, res: Response){
        const { id } = req.params; //const id = req.params.id

        if(!id || isNaN(Number(id))){
            return res.status(400).json({ erro: 'O id é obrigatório' });
        }

        const task = await Task.findOneBy({ id: Number(id) });
        //Task.delete({id: Number(id)});

        if(!task){
            return res.status(404).json({ erro: 'Não encontrado' });
        }

        task.remove();

        return res.status(204).send();
    }

    static async update(req: Request, res: Response){
        const { id } = req.params;
        const { title, completed } = req.body;

        if(!title){
            return res.status(400).json({erro: 'O título é obrigatório!'});
        }
        
        if(completed == undefined){
            return res.status(400).json({erro: 'O completo é obrigatório!'});
        }

        if(!id || isNaN(Number(id))){
            return res.status(400).json({erro: 'O id é obrigatório!'});
        }

        const task = await Task.findOneBy({id: Number(id)});

        if(!task){
            return res.status(404).json({erro: 'Task não encontrada'});
        }

        task.title = title;
        task.completed = completed;
        await task.save();

        return res.json(task);
    }
}

