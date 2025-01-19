import { DivingGroup, IDivingGroup } from '../models/DivingGroup';

export const createDivingGroup = async (data: Partial<IDivingGroup>) => {
    const newDivingGroup = new DivingGroup(data);
    return await newDivingGroup.save();
};

export const getAllDivingGroups = async () => {
    return await DivingGroup.find().populate('guide divers');
};

export const getDivingGroupById = async (id: string) => {
    return await DivingGroup.findById(id).populate('guide divers');
};

export const updateDivingGroup = async (id: string, data: Partial<IDivingGroup>) => {
    return await DivingGroup.findByIdAndUpdate(id, data, { new: true }).populate('guide divers');
};

export const deleteDivingGroup = async (id: string) => {
    return await DivingGroup.findByIdAndDelete(id);
};