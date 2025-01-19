import { Boat, IBoat } from '../models/Boat';

export const createBoat = async (data: Partial<IBoat>) => {
    const newBoat = new Boat(data);
    return await newBoat.save();
};

export const getAllBoats = async () => {
    return await Boat.find();
};

export const getBoatById = async (id: string) => {
    return await Boat.findById(id);
};

export const updateBoat = async (id: string, data: Partial<IBoat>) => {
    return await Boat.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBoat = async (id: string) => {
    return await Boat.findByIdAndDelete(id);
};