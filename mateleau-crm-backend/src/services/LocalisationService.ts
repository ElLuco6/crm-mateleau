import { Localisation } from '../models/Localisation';

export const createLocalisation = async (data: any) => {
  const newLocalisation = new Localisation(data);
  return await newLocalisation.save();
};

export const getAllLocalisations = async () => {
  return await Localisation.find();
};

export const deleteLocalisation = async (id: string) => {
  return await Localisation.findByIdAndDelete(id);
};
export const getLocalisationById = async (id: string) => {
  return await Localisation.findById(id);
};

export const updateLocalisation = async (id: string, data: any) => {
  return await Localisation.findByIdAndUpdate(id, data, { new: true });
};
