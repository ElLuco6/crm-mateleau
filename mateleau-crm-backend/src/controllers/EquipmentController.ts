import { Request, Response } from 'express';
import * as EquipmentService from '../services/EquipmentService';
import { IEquipment } from '../models/Equipment';

export const createEquipment = async (req: Request, res: Response) => {
    try {
        const newEquipment = await EquipmentService.createEquipment(req.body);
        res.status(201).json(newEquipment);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};
export const createMultipleEquipment = async (req: Request, res: Response) => {
    try{
        const newEquipment = await EquipmentService.createMultipleEquipment(req.body.equipment);
        res.status(201).json(newEquipment);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
}


export const getAllEquipment = async (req: Request, res: Response) => {
    try {
        const equipment = await EquipmentService.getAllEquipment();
        res.status(200).json(equipment);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const getEquipmentById = async (req: Request, res: Response) => {
    try {
        const equipment = await EquipmentService.getEquipmentById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        res.status(200).json(equipment);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const updateEquipment = async (req: Request, res: Response) => {
    try {
        const updatedEquipment = await EquipmentService.updateEquipment(req.params.id, req.body);
        if (!updatedEquipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        res.status(200).json(updatedEquipment);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const deleteEquipment = async (req: Request, res: Response) => {
    try {
        const deletedEquipment = await EquipmentService.deleteEquipment(req.params.id);
        if (!deletedEquipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        res.status(200).json({ message: 'Equipment deleted successfully' });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};