import { Request, Response } from 'express';
import * as DiverService from '../services/DiverService';
import { IDiver } from '../models/Diver';

export const createDiver = async (req: Request, res: Response) => {
    try {
        const newDiver = await DiverService.createDiver(req.body);
        res.status(201).json(newDiver);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const createMultipleDivers = async (req: Request, res: Response) => {
    try {
        const newDivers = await DiverService.createMultipleDivers(req.body.divers);
        res.status(201).json(newDivers);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const getAllDivers = async (req: Request, res: Response) => {
    try {
        const divers = await DiverService.getAllDivers();
        res.status(200).json(divers);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const getDiverById = async (req: Request, res: Response) => {
    try {
        const diver = await DiverService.getDiverById(req.params.id);
        if (!diver) {
            return res.status(404).json({ message: 'Diver not found' });
        }
        res.status(200).json(diver);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const updateDiver = async (req: Request, res: Response) => {
    try {
        const updatedDiver = await DiverService.updateDiver(req.params.id, req.body);
        if (!updatedDiver) {
            return res.status(404).json({ message: 'Diver not found' });
        }
        res.status(200).json(updatedDiver);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const deleteDiver = async (req: Request, res: Response) => {
    try {
        const deletedDiver = await DiverService.deleteDiver(req.params.id);
        if (!deletedDiver) {
            return res.status(404).json({ message: 'Diver not found' });
        }
        res.status(200).json({ message: 'Diver deleted successfully' });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};