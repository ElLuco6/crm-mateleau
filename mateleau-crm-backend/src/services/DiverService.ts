import { Diver, IDiver } from '../models/Diver';

export const createDiver = async (data: IDiver) => {
    const newDiver = new Diver(data);
    return await newDiver.save();
};

export const createMultipleDivers = async (divers: IDiver[]) => {
    return await Diver.insertMany(divers);
};

export const getAllDivers = async () => {
    return await Diver.find();
};

export const getDiverById = async (id: string) => {
    return await Diver.findById(id);
};

export const updateDiver = async (id: string, data: Partial<IDiver>) => {
    return await Diver.findByIdAndUpdate(id, data, { new: true });
};

export const deleteDiver = async (id: string) => {
    return await Diver.findByIdAndDelete(id);
};