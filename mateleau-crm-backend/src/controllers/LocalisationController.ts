import { Request, Response } from 'express';
import * as LocalisationService from '../services/LocalisationService';

export const createLocalisation = async (req: Request, res: Response) => {
  try {
    const Localisation = await LocalisationService.createLocalisation(req.body);
    res.status(201).json(Localisation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur création localisation' });
  }
};

export const getAllLocalisations = async (_: Request, res: Response) => {
  try {
    const Localisations = await LocalisationService.getAllLocalisations();
    res.json(Localisations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération localisations' });
  }
};

export const deleteLocalisation = async (req: Request, res: Response) => {
  try {
    await LocalisationService.deleteLocalisation(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression localisation' });
  }
};
export const getLocalisationById = async (req: Request, res: Response) => {
  try {
    const Localisation = await LocalisationService.getLocalisationById(req.params.id);
    if (!Localisation) {
      return res.status(404).json({ message: 'Localisation non trouvée' });
    }
    res.json(Localisation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération localisation' });
  }
};

export const updateLocalisation = async (req: Request, res: Response) => {
  try {
    const updated = await LocalisationService.updateLocalisation(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Localisation non trouvée' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur mise à jour localisation' });
  }
};
