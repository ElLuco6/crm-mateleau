import { Spot } from '../models/Spot';

export const createSpot = async (data: any) => {
  const newSpot = new Spot(data);
  return await newSpot.save();
};

export const getAllSpots = async () => {
  return await Spot.find();
};

export const deleteSpot = async (id: string) => {
  return await Spot.findByIdAndDelete(id);
};
export const getSpotById = async (id: string) => {
  return await Spot.findById(id);
};

export const updateSpot = async (id: string, data: any) => {
  return await Spot.findByIdAndUpdate(id, data, { new: true });
};
