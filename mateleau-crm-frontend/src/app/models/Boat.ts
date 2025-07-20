export class Boat  {
    _id: string;
    name: string;
    numberMaxPlaces: number;
    revisionDate: Date;
    constructor(_id:string,name: string, numberMaxPlaces: number, revisionDate: Date) {
      this._id = _id;
      this.name = name;
      this.numberMaxPlaces = numberMaxPlaces;
      this.revisionDate = revisionDate;
    }

  }
  