import { Request, Response } from 'express';
import * as BoatService from '../services/BoatService';

export const createBoat = async (req: Request, res: Response) => {
    try {
        const newBoat = await BoatService.createBoat(req.body);
        res.status(201).json(newBoat);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const getAllBoats = async (req: Request, res: Response) => {
    try {
        const boats = await BoatService.getAllBoats();
        res.status(200).json(boats);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const getBoatById = async (req: Request, res: Response) => {
    try {
        const boat = await BoatService.getBoatById(req.params.id);
        if (!boat) {
            return res.status(404).json({ message: 'Boat not found' });
        }
        res.status(200).json(boat);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const updateBoat = async (req: Request, res: Response) => {
    try {
        const updatedBoat = await BoatService.updateBoat(req.params.id, req.body);
        if (!updatedBoat) {
            return res.status(404).json({ message: 'Boat not found' });
        }
        res.status(200).json(updatedBoat);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const deleteBoat = async (req: Request, res: Response) => {
    try {
        const deletedBoat = await BoatService.deleteBoat(req.params.id);
        if (!deletedBoat) {
            return res.status(404).json({ message: 'Boat not found' });
        }
        res.status(200).json({ message: 'Boat deleted successfully' });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};