import { Request, Response } from 'express';
import * as SpotService from '../services/SpotService';

export const createSpot = async (req: Request, res: Response) => {
  try {
    const Spot = await SpotService.createSpot(req.body);
    res.status(201).json(Spot);
  } catch (err) {
    res.status(500).json({ message: 'Erreur création Spot' });
  }
};

export const getAllSpots = async (_: Request, res: Response) => {
  try {
    const Spots = await SpotService.getAllSpots();
    res.json(Spots);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération Spots' });
  }
};

export const deleteSpot = async (req: Request, res: Response) => {
  try {
    await SpotService.deleteSpot(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression Spot' });
  }
};
export const getSpotById = async (req: Request, res: Response) => {
  try {
    const Spot = await SpotService.getSpotById(req.params.id);
    if (!Spot) {
      return res.status(404).json({ message: 'Spot non trouvée' });
    }
    res.json(Spot);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération Spot' });
  }
};

export const updateSpot = async (req: Request, res: Response) => {
  try {
    const updated = await SpotService.updateSpot(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Spot non trouvée' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur mise à jour Spot' });
  }
};
