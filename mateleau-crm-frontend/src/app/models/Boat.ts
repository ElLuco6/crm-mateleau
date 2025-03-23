export class Boat  {
    id: string;
    name: string;
    numberMaxPlaces: number;
    revisionDate: Date;
    constructor(id:string,name: string, numberMaxPlaces: number, revisionDate: Date) {
      this.id = id;
      this.name = name;
      this.numberMaxPlaces = numberMaxPlaces;
      this.revisionDate = revisionDate;
    }

  }
  