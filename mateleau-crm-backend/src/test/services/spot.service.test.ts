import * as SpotService from '../../services/SpotService';
import { Spot } from '../../models/Spot';

jest.mock('../../models/Spot');

describe('SpotService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSpot', () => {
    it('should create and save a new spot', async () => {
      const mockSave = jest.fn().mockResolvedValue({ id: '1', name: 'Test Spot' });
      (Spot as any).mockImplementation(() => ({ save: mockSave }));

      const result = await SpotService.createSpot({ name: 'Test Spot' });

      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual({ id: '1', name: 'Test Spot' });
    });
  });

  describe('getAllSpots', () => {
    it('should return all spots', async () => {
      const mockSpots = [{ id: '1' }, { id: '2' }];
      (Spot.find as jest.Mock).mockResolvedValue(mockSpots);

      const result = await SpotService.getAllSpots();

      expect(Spot.find).toHaveBeenCalled();
      expect(result).toEqual(mockSpots);
    });
  });

  describe('getSpotById', () => {
    it('should return a spot by ID', async () => {
      const mockSpot = { id: '1' };
      (Spot.findById as jest.Mock).mockResolvedValue(mockSpot);

      const result = await SpotService.getSpotById('1');

      expect(Spot.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockSpot);
    });
  });

  describe('updateSpot', () => {
    it('should update and return a spot', async () => {
      const updated = { id: '1', name: 'Updated Spot' };
      (Spot.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

      const result = await SpotService.updateSpot('1', { name: 'Updated Spot' });

      expect(Spot.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'Updated Spot' }, { new: true });
      expect(result).toEqual(updated);
    });
  });

  describe('deleteSpot', () => {
    it('should delete a spot by ID', async () => {
      const deleted = { id: '1' };
      (Spot.findByIdAndDelete as jest.Mock).mockResolvedValue(deleted);

      const result = await SpotService.deleteSpot('1');

      expect(Spot.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(deleted);
    });
  });
});
