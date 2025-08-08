// routes/taskRoutes.js
import express, { Request, Response } from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/TaskController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        getAllTasks(req, res);
    });
});
router.post('/', createTask);
router.post('/', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        createTask(req, res);
    });
});
router.put('/:id', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        updateTask(req, res);
    });
});
router.delete('/:id', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        deleteTask(req, res);
    });
});



export default router;