import { Router } from 'express';
import TaskController from '../../controllers/task/task.controller';

const taskRoutes = Router()

taskRoutes.post('/', TaskController.create);
taskRoutes.get('/', TaskController.get);
taskRoutes.get('/:id', TaskController.search);
taskRoutes.delete('/:id', TaskController.delete);
taskRoutes.put('/:id', TaskController.update);

export default taskRoutes;