import express, { Request, Response } from 'express';
import { getTodayDashboard, getWeeklyDashboard } from '../controllers/DashboardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        getTodayDashboard(req, res);
    });
});

router.get('/week', (req: Request, res: Response) => {
    authenticateToken(req, res, () => {
        getWeeklyDashboard(req, res);
    });
});
    

export default router;