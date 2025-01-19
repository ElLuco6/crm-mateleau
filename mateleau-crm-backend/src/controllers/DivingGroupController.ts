import { Request, Response } from 'express';
import { DivingGroup, IDivingGroup } from '../models/DivingGroup';
import { Diver } from '../models/Diver';
import { Equipment } from '../models/Equipment';
import * as DivingGroupService from '../services/DivingGroupService';
import mongoose from 'mongoose'; 


export const createDivingGroup = async (req: Request, res: Response) => {
    try {
        const { guide, divers, equipmentAssignments } = req.body;

        // Create the diving group
        const rentedEquipment: { diverId: mongoose.Types.ObjectId; equipmentIds: mongoose.Types.ObjectId[] }[] = [];
        const newDivingGroup = await DivingGroupService.createDivingGroup({ guide, divers, rentedEquipment, groupSize: divers.length + 1 });

        // Assign equipment to divers
        for (const assignment of equipmentAssignments) {
            const { diverId, equipmentIds } = assignment;
            const diver = await Diver.findById(diverId);
            if (!diver) {
                return res.status(404).json({ message: `Diver with ID ${diverId} not found` });
            }

            const rentedEquipmentSet = new Set(rentedEquipment.flatMap(assignment => assignment.equipmentIds.map((equipmentId: mongoose.Types.ObjectId) => equipmentId.toString())));
            for (const equipmentId of equipmentIds) {
                const equipment = await Equipment.findById(equipmentId);
                if (!equipment) {
                    return res.status(404).json({ message: `Equipment with ID ${equipmentId} not found` });
                }
                if (rentedEquipmentSet.has(equipment.nature)) {
                    return res.status(400).json({ message: `Diver already has equipment of nature ${equipment.nature}` });
                }
                rentedEquipmentSet.add(equipment.nature);
            }
            rentedEquipment.push({ diverId: new mongoose.Types.ObjectId(diverId), equipmentIds: equipmentIds.map((id: string) => new mongoose.Types.ObjectId(id)) });
        }

        newDivingGroup.rentedEquipment = rentedEquipment;
        await newDivingGroup.save();

        res.status(201).json(newDivingGroup);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const getAllDivingGroups = async (req: Request, res: Response) => {
    try {
        const groups = await DivingGroupService.getAllDivingGroups();
        res.status(200).json(groups);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const getDivingGroupById = async (req: Request, res: Response) => {
    try {
        const group = await DivingGroupService.getDivingGroupById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Diving group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const updateDivingGroup = async (req: Request, res: Response) => {
    try {
        const updatedGroup = await DivingGroupService.updateDivingGroup(req.params.id, req.body);
        if (!updatedGroup) {
            return res.status(404).json({ message: 'Diving group not found' });
        }
        res.status(200).json(updatedGroup);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const deleteDivingGroup = async (req: Request, res: Response) => {
    try {
        const deletedGroup = await DivingGroupService.deleteDivingGroup(req.params.id);
        if (!deletedGroup) {
            return res.status(404).json({ message: 'Diving group not found' });
        }
        res.status(200).json({ message: 'Diving group deleted successfully' });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};