import { Dive } from '../models/Dive';
import { Equipment } from '../models/Equipment';
import { Boat } from '../models/Boat';

/**
 * Renvoie les bornes de date pour aujourd'hui (00:00 -> 23:59)
 */
function getDateRangeForToday(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.setHours(0, 0, 0, 0));
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start, end };
}

/**
 * Renvoie les bornes de date pour la semaine (aujourd'hui -> +7 jours)
 */
function getDateRangeForWeek(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.setHours(0, 0, 0, 0));
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end };
}

/**
 * Récupère les données du dashboard sur une période donnée
 */
async function fetchDashboardData(start: Date, end: Date) {
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

  return { dives, equipmentToReview, boatsToReview };
}

/**
 * Dashboard pour aujourd'hui
 */
export async function getTodayDashboardData() {
  const { start, end } = getDateRangeForToday();
  return await fetchDashboardData(start, end);
}

/**
 * Dashboard pour la semaine
 */
export async function getWeeklyDashboardData() {
  const { start, end } = getDateRangeForWeek();
  return await fetchDashboardData(start, end);
}
