// src/app/types/dive-detail.ts

export type Id = string;

export interface DiveDetail {
  _id: Id;
  name: string;
  location: string;
  date: string | Date;
  endDate: string | Date;
  duration: number;
  maxDepth: number;

  boat: Boat | null;
  driver: UserLite | null;

  divingGroups: Group[];

  totals?: {
    groups: number;
    divers: number;
  };
}

export interface Boat {
  _id: Id;
  name: string;
  numberAviablePlaces?: number;
  numberMaxPlaces?: number;
  revisionDate?: string | Date;
}

export interface UserLite {
  _id: Id;
  name: string;   // User côté backend = name (pas first/last)
  role: string;
  email?: string;
}

export interface DiverLite {
  _id: Id;
  firstName: string;
  lastName: string;
  divingLvl?: string;
  licenseNumber?: string;
}

export interface Equipment {
  _id: Id;
  name: string;
  nature?: string;
  size?: string;
  ref?: string;
  state?: string;
}

export interface RentedEquipment {
  diver: { _id: Id; firstName?: string; lastName?: string } | null;
  items: Equipment[];
}

export interface Group {
  _id: Id;
  guide: UserLite | null;
  groupSize?: number;
  divers: DiverLite[];
  rentedEquipment: RentedEquipment[];
}
