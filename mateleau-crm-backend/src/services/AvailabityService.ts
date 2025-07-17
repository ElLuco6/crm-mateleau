import { Dive } from '../models/Dive';
import { Boat } from '../models/Boat';
import { DivingGroup } from '../models/DivingGroup';
import { Equipment } from '../models/Equipment';
import { Diver } from '../models/Diver';
import { User } from '../models/User';

export const getAvailableBoats = async (date: string) => {
  const parsedDate = new Date(date);
 

  // Trouver les bateaux déjà occupés
  const occupiedBoats = await Dive.find({
    date: { $lte: parsedDate },
      endDate: { $gte: parsedDate }
  }).distinct('boat');

  // Retourner les bateaux disponibles
  return Boat.find({ _id: { $nin: occupiedBoats } });
};

export const getAvailableDivingGroups = async (date: string) => {
  const parsedDate = new Date(date);
  
  const occupiedGroups = await Dive.find({
    date: { $lte: parsedDate },
    endDate: { $gte: parsedDate }
  }).distinct('divingGroups');

  return DivingGroup.find({ _id: { $nin: occupiedGroups } });
};

export const getAvailableDivers = async (date: string) => {
  const parsedDate = new Date(date);
  

  const occupiedDivers = await Dive.find({
    date: { $lte: parsedDate },
      endDate: { $gte: parsedDate }
  }).distinct('divers');

  return Diver.find({ _id: { $nin: occupiedDivers } });
};

export const getAvailableEquipment = async (date: string) => {
  const parsedDate = new Date(date);
 
  const occupiedEquipment = await Dive.find({
    date: { $lte: parsedDate },
      endDate: { $gte: parsedDate }
  }).distinct('divingGroups.rentedEquipment.equipmentIds');

  return Equipment.find({ _id: { $nin: occupiedEquipment } });
}; 

export const getAvailableUsers = async (date: string) => {
  const parsedDate = new Date(date);

  const occupiedUsers = await Dive.find({
    date: { $lte: parsedDate },
    endDate: { $gte: parsedDate }
  }).distinct('User');

  return User.find({ _id: { $nin: occupiedUsers } });
};
