import { Dive } from '../models/Dive';
import { Boat } from '../models/Boat';
import { DivingGroup } from '../models/DivingGroup';
import { Equipment } from '../models/Equipment';
import { Diver } from '../models/Diver';

export const getAvailableBoats = async (date: string, duration: number) => {
  const parsedDate = new Date(date);
  const endDate = new Date(parsedDate.getTime() + duration * 60000);

  // Trouver les bateaux déjà occupés
  const occupiedBoats = await Dive.find({
    $or: [
      { date: { $lt: endDate, $gt: parsedDate } },
      { endDate: { $gt: parsedDate, $lt: endDate } },
    ],
  }).distinct('boat');

  // Retourner les bateaux disponibles
  return Boat.find({ _id: { $nin: occupiedBoats } });
};

export const getAvailableDivingGroups = async (date: string, duration: number) => {
  const parsedDate = new Date(date);
  const endDate = new Date(parsedDate.getTime() + duration * 60000);

  const occupiedGroups = await Dive.find({
    $or: [
      { date: { $lt: endDate, $gt: parsedDate } },
      { endDate: { $gt: parsedDate, $lt: endDate } },
    ],
  }).distinct('divingGroups');

  return DivingGroup.find({ _id: { $nin: occupiedGroups } });
};

export const getAvailableDivers = async (date: string, duration: number) => {
  const parsedDate = new Date(date);
  const endDate = new Date(parsedDate.getTime() + duration * 60000);

  const occupiedDivers = await Dive.find({
    $or: [
      { date: { $lt: endDate, $gt: parsedDate } },
      { endDate: { $gt: parsedDate, $lt: endDate } },
    ],
  }).distinct('divers');

  return Diver.find({ _id: { $nin: occupiedDivers } });
};

export const getAvailableEquipment = async (date: string, duration: number) => {
  const parsedDate = new Date(date);
  const endDate = new Date(parsedDate.getTime() + duration * 60000);

  const occupiedEquipment = await Dive.find({
    $or: [
      { date: { $lt: endDate, $gt: parsedDate } },
      { endDate: { $gt: parsedDate, $lt: endDate } },
    ],
  }).distinct('divingGroups.rentedEquipment.equipmentIds');

  return Equipment.find({ _id: { $nin: occupiedEquipment } });
};