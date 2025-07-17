import { Request, Response } from 'express';
import * as AvailabilityService from '../services/AvailabityService';

export const getAvailableBoats = async (req: Request, res: Response) => {
  try {
    const { date, duration } = req.query;

    if (!date || !duration) {
      return res.status(400).json({ message: "Date and duration are required" });
    }

    const availableBoats = await AvailabilityService.getAvailableBoats(date as string);
    res.json(availableBoats);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

export const getAvailableDivingGroups = async (req: Request, res: Response) => {
  try {
    const { date, duration } = req.query;

    if (!date || !duration) {
      return res.status(400).json({ message: "Date and duration are required" });
    }

    const availableGroups = await AvailabilityService.getAvailableDivingGroups(date as string);
    res.json(availableGroups);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

export const getAvailableEquipment = async (req: Request, res: Response) => {
  try {
    const { date, duration } = req.query;

    if (!date || !duration) {
      return res.status(400).json({ message: "Date and duration are required" });
    }

    const availableEquipment = await AvailabilityService.getAvailableEquipment(date as string);
    res.json(availableEquipment);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

export const getAvailableDivers = async (req: Request, res: Response) => {
  try {
    const { date, duration } = req.query;

    if (!date || !duration) {
      return res.status(400).json({ message: "Date and duration are required" });
    }

    const availableDivers = await AvailabilityService.getAvailableDivers(date as string);
    res.json(availableDivers);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};



export const getAvailableUsers = async (req: Request, res: Response) => {
  try {
    const { date, duration } = req.query;

    if (!date || !duration) {
      return res.status(400).json({ message: "Date and duration are required" });
    }

    const availableUsers = await AvailabilityService.getAvailableUsers(date as string);
    res.json(availableUsers);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};