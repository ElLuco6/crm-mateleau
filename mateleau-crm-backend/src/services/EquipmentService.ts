import { Equipment, IEquipment } from '../models/Equipment';

export const createEquipment = async (data: Partial<IEquipment>) => {
    const newEquipment = new Equipment(data);
    return await newEquipment.save();
};

export const createMultipleEquipment = async (equipment: IEquipment[]) => {
    return await Equipment.insertMany(equipment);
};

export const getAllEquipment = async () => {
    return await Equipment.find();
};

export const getEquipmentById = async (id: string) => {
    return await Equipment.findById(id);
};

export const updateEquipment = async (id: string, data: Partial<IEquipment>) => {
    return await Equipment.findByIdAndUpdate(id, data, { new: true });
};

export const deleteEquipment = async (id: string) => {
    return await Equipment.findByIdAndDelete(id);
};