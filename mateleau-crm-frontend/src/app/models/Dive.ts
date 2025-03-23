import { DivingGroup } from './DivingGroup';
import { Boat } from './Boat';
import { User } from './User';

export class Dive {
  id: string; 
  name: string;
  location: string;
  date: Date;
  duration: number; // Durée en minutes
  maxDepth: number;
  divingGroups: DivingGroup[];
  boat: Boat;
  driver: User;

  constructor(
    id: string,
    name: string,
    location: string,
    date: Date,
    duration: number,
    maxDepth: number,
    divingGroups: DivingGroup[],
    boat: Boat,
    driver: User
  ) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.date = date;
    this.duration = duration;
    this.maxDepth = maxDepth;
    this.divingGroups = divingGroups;
    this.boat = boat;
    this.driver = driver;
  }
}
