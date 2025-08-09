import { Request, Response } from 'express';
import {
  getTodayDashboardData,
  getWeeklyDashboardData,
} from '../services/DashboardService';

export async function getTodayDashboard(req: Request, res: Response) {
  try {
    const data = await getTodayDashboardData();
    return res.json(data);
  } catch (err) {
    
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

export async function getWeeklyDashboard(req: Request, res: Response) {
  try {
    const data = await getWeeklyDashboardData();
    return res.json(data);
  } catch (err) {
   
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
