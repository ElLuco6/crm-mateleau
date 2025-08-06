import * as BoatService from '../../services/BoatService';
import { Boat } from '../../models/Boat';

jest.mock('../../models/Boat');

describe('BoatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBoat', () => {
    it('should create and save a new boat', async () => {
      const mockData = { name: 'New Boat' };
      const mockSave = jest.fn().mockResolvedValue({ _id: '123', ...mockData });

      // @ts-ignore
      (Boat as jest.Mock).mockImplementation(() => ({ save: mockSave }));

      const result = await BoatService.createBoat(mockData);

      expect(Boat).toHaveBeenCalledWith(mockData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual({ _id: '123', ...mockData });
    });
  });

  describe('getAllBoats', () => {
    it('should return all boats', async () => {
      const mockBoats = [{ name: 'Boat1' }, { name: 'Boat2' }];
      (Boat.find as jest.Mock).mockResolvedValue(mockBoats);

      const result = await BoatService.getAllBoats();

      expect(Boat.find).toHaveBeenCalled();
      expect(result).toEqual(mockBoats);
    });
  });

  describe('getBoatById', () => {
    it('should return the boat by id', async () => {
      const mockBoat = { _id: '123', name: 'Boat A' };
      (Boat.findById as jest.Mock).mockResolvedValue(mockBoat);

      const result = await BoatService.getBoatById('123');

      expect(Boat.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockBoat);
    });
  });

  describe('updateBoat', () => {
    it('should update the boat and return the new version', async () => {
      const mockUpdated = { _id: '123', name: 'Updated Boat' };
      (Boat.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await BoatService.updateBoat('123', { name: 'Updated Boat' });

      expect(Boat.findByIdAndUpdate).toHaveBeenCalledWith('123', { name: 'Updated Boat' }, { new: true });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('deleteBoat', () => {
    it('should delete the boat and return the deleted doc', async () => {
      const mockDeleted = { _id: '123', name: 'Deleted Boat' };
      (Boat.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeleted);

      const result = await BoatService.deleteBoat('123');

      expect(Boat.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockDeleted);
    });
  });
});
