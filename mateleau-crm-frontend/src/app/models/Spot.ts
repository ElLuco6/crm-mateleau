export class Spot  {
  _id?: string;
  name: string;
  latitude: number;
  longitude: number;

   constructor(_id:string,name: string, latitude: number, longitude: number) {
      this._id = _id;
      this.name = name;
      this.latitude = latitude;
      this.longitude = longitude;
    }
}
