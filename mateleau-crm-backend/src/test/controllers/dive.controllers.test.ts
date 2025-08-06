import * as DiveController from '../../controllers/DiveControllers';
import * as DiveService from '../../services/DiveService';
import { Boat } from '../../models/Boat';
import { User } from '../../models/User';
import { DivingGroup } from '../../models/DivingGroup';
import { Dive } from '../../models/Dive';
import { Request, Response } from 'express';
import { Diver } from '../../models/Diver'; 

jest.mock('../../models/Boat');
jest.mock('../../models/User');
jest.mock('../../models/DivingGroup');
jest.mock('../../models/Dive');
jest.mock('../../models/Diver');
jest.mock('../../services/DiveService');

describe('DiveController - createDive', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  const baseBody = {
    name: 'Plongée Test',
    location: 'Bora Bora',
    date: new Date().toISOString(),
    endDate: new Date(Date.now() + 60 * 60000).toISOString(), // +1h
    maxDepth: 20,
    divingGroups: ['g1'],
    boat: 'boat1',
    driver: 'user1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = { body: { ...baseBody } };
    res = { status: statusMock, json: jsonMock };
  });

  it('should return 400 if endDate is before date', async () => {
    req.body!.endDate = new Date(Date.now() - 10000).toISOString();

    await DiveController.createDive(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'endDate must be after date' });
  });

  it('should return 404 if boat is not found', async () => {
    (Boat.findById as jest.Mock).mockResolvedValue(null);

    await DiveController.createDive(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Boat not found' });
  });

  it('should return 404 if driver is not found', async () => {
    (Boat.findById as jest.Mock).mockResolvedValue({ numberMaxPlaces: 10 });
    (User.findById as jest.Mock).mockResolvedValue(null);

    await DiveController.createDive(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Driver not found' });
  });

  it('should return 404 if diving groups are missing', async () => {
    (Boat.findById as jest.Mock).mockResolvedValue({ numberMaxPlaces: 10 });
    (User.findById as jest.Mock).mockResolvedValue({ _id: 'user1' });
    (DivingGroup.find as jest.Mock).mockResolvedValue([]); // aucun groupe trouvé

    await DiveController.createDive(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'One or more diving groups not found' });
  });

  it('should return 400 if driver is part of a diving group', async () => {
    (Boat.findById as jest.Mock).mockResolvedValue({ numberMaxPlaces: 10 });
    (User.findById as jest.Mock).mockResolvedValue({ _id: 'user1' });
    (DivingGroup.find as jest.Mock).mockResolvedValue([
      { divers: ['user1'], guide: 'guide1', rentedEquipment: [] },
    ]);

    await DiveController.createDive(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Driver cannot be part of a diving group' });
  });

  it('should return 400 if too many people for the boat', async () => {
    (Boat.findById as jest.Mock).mockResolvedValue({ numberMaxPlaces: 2 });
    (User.findById as jest.Mock).mockResolvedValue({ _id: 'user1' });
    (DivingGroup.find as jest.Mock).mockResolvedValue([
      { divers: ['d1', 'd2'], guide: 'g1', rentedEquipment: [] },
    ]);

    await DiveController.createDive(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'The number of people exceeds the maximum capacity of the boat',
    });
  });

  it('should return 400 if a diver has insufficient level', async () => {
  (Boat.findById as jest.Mock).mockResolvedValue({ numberMaxPlaces: 10 });
  (User.findById as jest.Mock).mockResolvedValue({ _id: 'user1' });
  (DivingGroup.find as jest.Mock).mockResolvedValue([
    { divers: ['diver1'], guide: 'g1', rentedEquipment: [] },
  ]);

  (Diver.findById as jest.Mock).mockResolvedValue({
    divingLvl: 0,
    firstName: 'Jean',
  });

  await DiveController.createDive(req as Request, res as Response);

  expect(statusMock).toHaveBeenCalledWith(400);
  expect(jsonMock).toHaveBeenCalledWith({
    message: 'Diver Jean does not have the required diving level for this depth',
  });
});

  it('should return 400 if overlapping dive exists', async () => {
    (Boat.findById as jest.Mock).mockResolvedValue({ numberMaxPlaces: 10 });
    (User.findById as jest.Mock).mockResolvedValue({ _id: 'user1', divingLvl: 5 });
    (DivingGroup.find as jest.Mock).mockResolvedValue([
      { divers: [], guide: 'g1', rentedEquipment: [] },
    ]);
    (Dive.find as jest.Mock).mockResolvedValue([{ id: 'overlapDive' }]);

    await DiveController.createDive(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Boat, driver, or diving groups are not available during this period',
    });
  });

  it('should create dive if all checks pass', async () => {
    const fakeDive = { id: 'newDive' };

    (Boat.findById as jest.Mock).mockResolvedValue({ numberMaxPlaces: 10 });
    (User.findById as jest.Mock).mockResolvedValue({ _id: 'user1', divingLvl: 5 });
    (DivingGroup.find as jest.Mock).mockResolvedValue([
      { divers: [], guide: 'g1', rentedEquipment: [] },
    ]);
    (Dive.find as jest.Mock).mockResolvedValue([]);
    (DiveService.createDive as jest.Mock).mockResolvedValue(fakeDive);

    await DiveController.createDive(req as Request, res as Response);

    expect(DiveService.createDive).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(fakeDive);
  });
});
