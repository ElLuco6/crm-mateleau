import  mongoose , { Types } from 'mongoose';
import { Dive, IDive } from '../models/Dive';
import {DivePopulatedLean,BoatLean,DiverLean,UserLean, EquipmentLean} from '../types/dive-details';



export const createDive = async (data: Partial<IDive>) => {
    const newDive = new Dive(data);
    return await newDive.save();
};

export const getAllDives = async () => {
    return await Dive.find().populate('divingGroups boat driver');
};

export const getDiveById = async (id: string) => {
    return await Dive.findById(id).populate('divingGroups boat driver');
};

export const updateDive = async (id: string, data: Partial<IDive>) => {
    return await Dive.findByIdAndUpdate(id, data, { new: true }).populate('divingGroups boat driver');
};

export const deleteDive = async (id: string) => {
    return await Dive.findByIdAndDelete(id);
};

const asDoc = <T>(v: any): T | null =>
  v && !(v instanceof Types.ObjectId) && !mongoose.isValidObjectId(v) ? (v as T) : null;



export const getDiveDetailById = async (diveId: string) => {
    if (!Types.ObjectId.isValid(diveId)) {
      const err: any = new Error('Invalid dive id');
      err.status = 400;
      throw err;
    }

     const dive = await Dive.findById(diveId)
    // Boat (pas de boat.driver dans le schéma)
    .populate({
      path: 'boat',
      select: 'name numberAviablePlaces numberMaxPlaces revisionDate',
    })
    // Driver de la plongée (User → "name", pas first/last)
    .populate({
      path: 'driver',
      model: 'User',
      select: 'name role email',
    })
    // DivingGroup est une ref → populate la ref PUIS ses champs internes
    .populate({
      path: 'divingGroups',
      populate: [
        { path: 'guide', model: 'User', select: 'name role' },
        { path: 'divers', model: 'Diver', select: 'firstName lastName divingLvl email' },
        { path: 'rentedEquipment.diverId', model: 'Diver', select: 'firstName lastName email' },
        { path: 'rentedEquipment.equipmentIds', model: 'Equipment', select: 'name nature size ref state' },
      ],
    })
    .lean<DivePopulatedLean>()
    .exec();

  if (!dive) {
    const err: any = new Error('Dive not found');
    err.status = 404;
    throw err;
  }

  const boat = asDoc<BoatLean>(dive.boat);
  const driver = asDoc<UserLean>(dive.driver);

  const dto = {
    _id: dive._id,
    name: dive.name,
    location: dive.location,
    date: dive.date,
    endDate: dive.endDate,
    duration: dive.duration,
    maxDepth: dive.maxDepth,

    boat: boat && {
      _id: boat._id,
      name: boat.name,
      numberAviablePlaces: boat.numberAviablePlaces,
      numberMaxPlaces: boat.numberMaxPlaces,
      revisionDate: boat.revisionDate,
    },

    driver: driver && {
      _id: driver._id,
      name: driver.name,
      role: driver.role,
      email: driver.email
      
    },

    divingGroups: (dive.divingGroups || []).map((g) => {
      const guide = asDoc<UserLean>(g.guide);
      return {
        _id: g._id,
        guide: guide && { _id: guide._id, name: guide.name, role: guide.role },
        groupSize: g.groupSize,
        divers: (g.divers || []).map((d) =>
          typeof d === 'object'
            ? {
                _id: (d as DiverLean)._id,
                firstName: (d as DiverLean).firstName,
                lastName: (d as DiverLean).lastName,
                divingLvl: (d as DiverLean).divingLvl,
                licenseNumber: (d as DiverLean).licenseNumber,
                email: (d as DiverLean).email,
              }
            : { _id: d }
        ),
        rentedEquipment: (g.rentedEquipment || []).map((r) => {
          const diverDoc = asDoc<DiverLean>(r.diverId);
          return {
            diver: diverDoc
              ? { _id: diverDoc._id, firstName: diverDoc.firstName, lastName: diverDoc.lastName }
              : r.diverId
              ? { _id: r.diverId }
              : null,
            items: (r.equipmentIds || []).map((eq) =>
              typeof eq === 'object'
                ? {
                    _id: (eq as EquipmentLean)._id,
                    name: (eq as EquipmentLean).name,
                    nature: (eq as EquipmentLean).nature,
                    size: (eq as EquipmentLean).size,
                    ref: (eq as EquipmentLean).ref,
                    state: (eq as EquipmentLean).state,
                  }
                : { _id: eq }
            ),
          };
        }),
      };
    }),

    totals: {
      groups: (dive.divingGroups || []).length,
      divers: (dive.divingGroups || []).reduce(
        (acc, g) => acc + (g.divers?.length || 0),
        0
      ),
    },
  };

  

  return dto;
  }