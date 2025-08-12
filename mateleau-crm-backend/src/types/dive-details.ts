import { Types } from 'mongoose';

export type BoatLean = {
  _id: any;
  name: string;
  numberAviablePlaces?: number;
  numberMaxPlaces?: number;
  revisionDate?: Date | string;
};

export type UserLean = {
  _id: any;
  name: string;      // ⚠️ ton User a "name", pas firstName/lastName
  role: string;
  email?: string;
};

export type DiverLean = {
  _id: any;
  firstName: string;
  lastName: string;
  divingLvl?: string;
  licenseNumber?: string;
  email?: string; // Ajout de l'email pour le DiverLean
};

export type EquipmentLean = {
  _id: any;
  name: string;
  nature?: string;
  size?: string;
  ref?: string;
  state?: string;
};

export type RentedEquipmentLean = {
  diverId: DiverLean | Types.ObjectId | null;
  equipmentIds: Array<EquipmentLean | Types.ObjectId>;
};

export type DivingGroupLean = {
  _id: any;
  guide: UserLean | Types.ObjectId | null;
  divers: Array<DiverLean | Types.ObjectId>;
  rentedEquipment: RentedEquipmentLean[];
  groupSize?: number;
};

export type DivePopulatedLean = {
  _id: any;
  name: string;
  location: string;
  date: Date | string;
  endDate: Date | string;
  duration: number;
  maxDepth: number;
  boat: BoatLean | Types.ObjectId | null;
  driver: UserLean | Types.ObjectId | null;
  divingGroups: DivingGroupLean[];
};