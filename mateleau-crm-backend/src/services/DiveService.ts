import { Dive, IDive } from '../models/Dive';

export const createDive = async (data: Partial<IDive>) => {
    const newDive = new Dive(data);
    return await newDive.save();
};

export const getAllDives = async () => {
    return await Dive.find().populate('divingGroups boat driver');
};

export const getDiveById = async (id: string) => {
    return await Dive.findById(id).populate('divingGroups boat driver');
};

export const updateDive = async (id: string, data: Partial<IDive>) => {
    return await Dive.findByIdAndUpdate(id, data, { new: true }).populate('divingGroups boat driver');
};

export const deleteDive = async (id: string) => {
    return await Dive.findByIdAndDelete(id);
};