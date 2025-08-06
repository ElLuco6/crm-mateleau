import {
  getTodayDashboardData,
  getWeeklyDashboardData,
} from '../../services/DashboardService';

import { Dive } from '../../models/Dive';
import { Equipment } from '../../models/Equipment';
import { Boat } from '../../models/Boat';

jest.mock('../../models/Dive');
jest.mock('../../models/Equipment');
jest.mock('../../models/Boat');

describe('DashboardService', () => {
  const mockDives = [{ id: 'd1' }];
  const mockEquipment = [{ id: 'e1' }];
  const mockBoats = [{ id: 'b1' }];

  beforeEach(() => {
    jest.clearAllMocks();

    // ✅ Mock Dive.find().populate().populate().populate() → mockDives
    const populate = jest.fn();
    const findResult = { populate };
    populate
      .mockReturnValueOnce(findResult) // .populate('driver')
      .mockReturnValueOnce(findResult) // .populate({ path: 'divingGroups', ... })
      .mockReturnValueOnce(mockDives); // final await returns mockDives

    (Dive.find as jest.Mock).mockReturnValue(findResult);

    // ✅ autres mocks
    (Equipment.find as jest.Mock).mockResolvedValue(mockEquipment);
    (Boat.find as jest.Mock).mockResolvedValue(mockBoats);
  });

  it('should fetch today dashboard data', async () => {
    const result = await getTodayDashboardData();

    expect(Dive.find).toHaveBeenCalled();
    expect(Equipment.find).toHaveBeenCalled();
    expect(Boat.find).toHaveBeenCalled();

    expect(result).toEqual({
      dives: mockDives,
      equipmentToReview: mockEquipment,
      boatsToReview: mockBoats,
    });
  });

  it('should fetch weekly dashboard data', async () => {
    const result = await getWeeklyDashboardData();

    expect(Dive.find).toHaveBeenCalled();
    expect(Equipment.find).toHaveBeenCalled();
    expect(Boat.find).toHaveBeenCalled();

    expect(result).toEqual({
      dives: mockDives,
      equipmentToReview: mockEquipment,
      boatsToReview: mockBoats,
    });
  });
});
