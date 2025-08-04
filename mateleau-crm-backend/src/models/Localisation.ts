import mongoose from 'mongoose';

const LocalisationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export const Localisation = mongoose.model('Localisation', LocalisationSchema);
