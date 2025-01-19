import mongoose, { Schema, Document } from 'mongoose';
import { IDivingGroup } from './DivingGroup';
import { IBoat } from './Boat';
import { IUser } from './User';

interface IDive extends Document {
  name: string;
  location: string;
  date: Date;
  duration: number; // Durée en minutes
  maxDepth: number;
  divingGroups: mongoose.Types.ObjectId[] | IDivingGroup[];
  boat: mongoose.Types.ObjectId | IBoat;
  driver: mongoose.Types.ObjectId | IUser; // Référence au conducteur
}

const diveSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // Ajouter la durée
  maxDepth: { type: Number, required: true },
  divingGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DivingGroup', required: true }],
  boat: { type: mongoose.Schema.Types.ObjectId, ref: 'Boat', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence au conducteur
});

const Dive = mongoose.model<IDive>('Dive', diveSchema);

export { Dive, IDive };