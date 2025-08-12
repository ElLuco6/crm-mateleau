import { Request, Response } from "express";
import * as DiveService from "../services/DiveService";
import { IDive } from "../models/Dive";
import { DivingGroup } from "../models/DivingGroup";
import { Diver, IDiver } from "../models/Diver";
import { IUser, User } from "../models/User";
import { Boat } from "../models/Boat";
import { Dive } from "../models/Dive";
import mongoose from 'mongoose';



export const createDive = async (req: Request, res: Response) => {
  try {
    const {
      name,
      location,
      date,
      endDate,    
      maxDepth,
      divingGroups,
      boat,
      driver,
    } = req.body;

    // Get the duration in minutes
    const startDate = new Date(date);
    const endDateObj = new Date(endDate);
    const duration = Math.floor((endDateObj.getTime() - startDate.getTime()) / 60000); // Différence en minutes

    if (duration <= 0) {
      return res.status(400).json({ message: "endDate must be after date" });
    }

    // Verify the boat
    const boatExists = await Boat.findById(boat);
    if (!boatExists) {
      return res.status(404).json({ message: "Boat not found" });
    }

    // Verify the driver
    const driverExists = await User.findById(driver);
    if (!driverExists) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Verify the diving groups
    const groups = await DivingGroup.find({ _id: { $in: divingGroups } });
    if (groups.length !== divingGroups.length) {
      return res
        .status(404)
        .json({ message: "One or more diving groups not found" });
    }

    // Ensure the driver is not part of any diving group
    for (const group of groups) {
      if (group.divers.includes(driver)) {
        return res
          .status(400)
          .json({ message: "Driver cannot be part of a diving group" });
      }
    }

    // Calculate the total number of people
    const totalPeople =
      groups.reduce((acc, group) => acc + group.divers.length + 1, 0) + 1; // +1 for each guide and +1 for the driver

    if (totalPeople > boatExists.numberMaxPlaces) {
      return res
        .status(400)
        .json({
          message:
            "The number of people exceeds the maximum capacity of the boat",
        });
    }

    const divingLevelRequirements = {
      0: 10,
      1: 20,
      2: 40,
      3: 60,
      4: 60,
      5: 60,
    };


    for (const group of groups) {
      for (const diver of group.divers) {
          const diverData = await Diver.findById(diver);
          if (diverData && divingLevelRequirements[diverData.divingLvl] < maxDepth) {
              return res.status(400).json({ message: `Diver ${diverData.firstName} does not have the required diving level for this depth` });
          }
      }
  }


    // Check availability
   // const endDate = new Date(new Date(date).getTime() + duration * 60000);
    const overlappingDives = await Dive.find({
      $and: [
        {
          $or: [
            { date: { $lt: endDate, $gt: date } },
            { endDate: { $gt: date, $lt: endDate } },
          ],
        },
        {
            $or: [
                { boat },
                { driver },
                { divingGroups: { $in: divingGroups } },
                { 'divingGroups.divers': { $in: groups.flatMap(group => group.divers) } },
                { 'divingGroups.guide': { $in: groups.map(group => group.guide) } },
                { 'divingGroups.rentedEquipment.equipmentIds': { $in: groups.flatMap(group => group.rentedEquipment.flatMap(equipment => equipment.equipmentIds as mongoose.Types.ObjectId[])) } },
            ],
        },
      ],
    });

    if (overlappingDives.length > 0) {
      return res
        .status(400)
        .json({
          message:
            "Boat, driver, or diving groups are not available during this period",
        });
    }

    // Create the dive
    const newDive = await DiveService.createDive({
      name,
      location,
      date,
      endDate,
      duration,
      maxDepth,
      divingGroups,
      boat,
      driver,
    });
    res.status(201).json(newDive);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
};

export const getAllDives = async (req: Request, res: Response) => {
  try {
    const dives = await DiveService.getAllDives();
    res.status(200).json(dives);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
};

export const getDiveById = async (req: Request, res: Response) => {
  try {
    const dive = await DiveService.getDiveById(req.params.id);
    if (!dive) {
      return res.status(404).json({ message: "Dive not found" });
    }
    res.status(200).json(dive);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
};

export const updateDive = async (req: Request, res: Response) => {
  try {
    const updatedDive = await DiveService.updateDive(req.params.id, req.body);
    if (!updatedDive) {
      return res.status(404).json({ message: "Dive not found" });
    }
    res.status(200).json(updatedDive);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
};

export const deleteDive = async (req: Request, res: Response) => {
  try {
    const deletedDive = await DiveService.deleteDive(req.params.id);
    if (!deletedDive) {
      return res.status(404).json({ message: "Dive not found" });
    }
    res.status(200).json({ message: "Dive deleted successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
};

export const getDiveDetail = async (req: Request, res: Response ) => {
  try {
    const data = await DiveService.getDiveDetailById(req.params.id);
    res.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage });
  }
};

