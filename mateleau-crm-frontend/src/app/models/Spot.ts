export class Spot  {
  _id?: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
    createdAt?: Date;

   constructor(_id:string,name: string, lat: number, lng: number, createdAt?: Date) {
      this._id = _id;
      this.name = name;
      this.coordinates = { lat, lng };
      this.createdAt = createdAt;
    }
}
