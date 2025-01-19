import mongoose, { Schema, Document } from 'mongoose';

interface IBoat extends Document {
  name: string;
  numberMaxPlaces: number;
  revisionDate: Date;
}

const boatSchema: Schema = new Schema({
  name: { type: String, required: true },
  numberMaxPlaces: { type: Number, required: true },
  revisionDate: { type: Date, required: true },
});

const Boat = mongoose.model<IBoat>('Boat', boatSchema);

export { Boat, IBoat };