import * as AvailabilityService from '../../services/AvailabityService';
import { Dive } from '../../models/Dive';
import { Boat } from '../../models/Boat';
import { DivingGroup } from '../../models/DivingGroup';
import { Equipment } from '../../models/Equipment';
import { Diver } from '../../models/Diver';
import { User } from '../../models/User';

jest.mock('../../models/Dive');
jest.mock('../../models/Boat');
jest.mock('../../models/DivingGroup');
jest.mock('../../models/Equipment');
jest.mock('../../models/Diver');
jest.mock('../../models/User');

describe('AvailabilityService', () => {
  const mockDate = '2025-08-06';
  const mockParsedDate = new Date(mockDate);
  const mockOccupiedIds = ['id1', 'id2'];
  const mockAvailableItems = [{ _id: 'id3' }, { _id: 'id4' }];

  const setupDiveMock = (field: string) => {
    const findMock = {
      distinct: jest.fn().mockResolvedValue(mockOccupiedIds),
    };
    // @ts-ignore
    (Dive.find as jest.Mock).mockReturnValue(findMock);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get available boats', async () => {
    setupDiveMock('boat');
    (Boat.find as jest.Mock).mockResolvedValue(mockAvailableItems);

    const result = await AvailabilityService.getAvailableBoats(mockDate);

    expect(Dive.find).toHaveBeenCalledWith({
      date: { $lte: mockParsedDate },
      endDate: { $gte: mockParsedDate },
    });
    expect(Boat.find).toHaveBeenCalledWith({ _id: { $nin: mockOccupiedIds } });
    expect(result).toEqual(mockAvailableItems);
  });

  it('should get available diving groups', async () => {
    setupDiveMock('divingGroups');
    (DivingGroup.find as jest.Mock).mockResolvedValue(mockAvailableItems);

    const result = await AvailabilityService.getAvailableDivingGroups(mockDate);

    expect(DivingGroup.find).toHaveBeenCalledWith({ _id: { $nin: mockOccupiedIds } });
    expect(result).toEqual(mockAvailableItems);
  });

  it('should get available divers', async () => {
    setupDiveMock('divers');
    (Diver.find as jest.Mock).mockResolvedValue(mockAvailableItems);

    const result = await AvailabilityService.getAvailableDivers(mockDate);

    expect(Diver.find).toHaveBeenCalledWith({ _id: { $nin: mockOccupiedIds } });
    expect(result).toEqual(mockAvailableItems);
  });

  it('should get available equipment', async () => {
    setupDiveMock('divingGroups.rentedEquipment.equipmentIds');
    (Equipment.find as jest.Mock).mockResolvedValue(mockAvailableItems);

    const result = await AvailabilityService.getAvailableEquipment(mockDate);

    expect(Equipment.find).toHaveBeenCalledWith({ _id: { $nin: mockOccupiedIds } });
    expect(result).toEqual(mockAvailableItems);
  });

  it('should get available users', async () => {
    setupDiveMock('User');
    (User.find as jest.Mock).mockResolvedValue(mockAvailableItems);

    const result = await AvailabilityService.getAvailableUsers(mockDate);

    expect(User.find).toHaveBeenCalledWith({ _id: { $nin: mockOccupiedIds } });
    expect(result).toEqual(mockAvailableItems);
  });
});
