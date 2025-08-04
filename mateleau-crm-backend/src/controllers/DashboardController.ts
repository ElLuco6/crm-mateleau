// controllers/dashboard.controller.ts
import { Request, Response } from 'express';
import { Dive } from '../models/Dive';
import { Equipment } from '../models/Equipment';
import { Boat } from '../models/Boat';

export async function getTodayDashboard(req: Request, res: Response) {
  try {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 1. Plongées prévues aujourd’hui
    const dives = await Dive.find({
      date: { $gte: today, $lt: tomorrow },
    })
      .populate('boat')
      .populate('driver')
      .populate({
        path: 'divingGroups',
        populate: [{ path: 'guide' }, { path: 'divers' }],
      });

    // 2. Matériel à réviser
    const equipmentToReview = await Equipment.find({
      nextMaintenanceDate: { $gte: today, $lt: tomorrow },
    });

    // 3. Bateaux à réviser
    const boatsToReview = await Boat.find({
      revisionDate: { $gte: today, $lt: tomorrow },
    });

    return res.json({
      dives,
      equipmentToReview,
      boatsToReview,
    });
  } catch (err) {
    console.error('❌ Erreur dashboard', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// utils/date.ts (optionnel si tu veux extraire)
function getDateRangeForWeek(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.setHours(0, 0, 0, 0));
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end };
}


export const getWeeklyDashboard = async (req: Request, res: Response) => {
  try {
    const { start, end } = getDateRangeForWeek();

    const dives = await Dive.find({
      date: { $gte: start, $lt: end },
    })
      .populate('boat')
      .populate('driver')
      .populate({
        path: 'divingGroups',
        populate: [{ path: 'guide' }, { path: 'divers' }],
      });

    const equipmentToReview = await Equipment.find({
      nextMaintenanceDate: { $gte: start, $lt: end },
    });

    const boatsToReview = await Boat.find({
      revisionDate: { $gte: start, $lt: end },
    });

    return res.json({
      dives,
      equipmentToReview,
      boatsToReview,
    });
  } catch (err) {
    console.error('❌ Erreur dashboard semaine :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

