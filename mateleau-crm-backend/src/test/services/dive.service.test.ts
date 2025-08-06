import * as DiveService from '../../services/DiveService';
import { Dive } from '../../models/Dive';
import { IDive } from '../../models/Dive';

jest.mock('../../models/Dive');

describe('DiveService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDive', () => {
    it('should create and save a new dive', async () => {
      const mockData = { name: 'Test Dive' };
      const mockSave = jest.fn().mockResolvedValue({ _id: 'd1', ...mockData });

      // @ts-ignore
      (Dive as jest.Mock).mockImplementation(() => ({ save: mockSave }));

      const result = await DiveService.createDive(mockData as Partial<IDive>);

      expect(Dive).toHaveBeenCalledWith(mockData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual({ _id: 'd1', ...mockData });
    });
  });

  describe('getAllDives', () => {
    it('should return all dives with population', async () => {
      const mockResult = [{ name: 'Dive 1' }];
      const populateMock = jest.fn().mockResolvedValue(mockResult);
      (Dive.find as jest.Mock).mockReturnValue({ populate: populateMock });

      const result = await DiveService.getAllDives();

      expect(Dive.find).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalledWith('divingGroups boat driver');
      expect(result).toEqual(mockResult);
    });
  });

  describe('getDiveById', () => {
    it('should return dive by ID with population', async () => {
      const mockDive = { name: 'Dive ID' };
      const populateMock = jest.fn().mockResolvedValue(mockDive);
      (Dive.findById as jest.Mock).mockReturnValue({ populate: populateMock });

      const result = await DiveService.getDiveById('123');

      expect(Dive.findById).toHaveBeenCalledWith('123');
      expect(populateMock).toHaveBeenCalledWith('divingGroups boat driver');
      expect(result).toEqual(mockDive);
    });
  });

  describe('updateDive', () => {
    it('should update dive by ID and return new one with population', async () => {
      const updatedDive = { _id: '123', name: 'Updated Dive' };
      const populateMock = jest.fn().mockResolvedValue(updatedDive);
      (Dive.findByIdAndUpdate as jest.Mock).mockReturnValue({ populate: populateMock });

      const result = await DiveService.updateDive('123', { name: 'Updated Dive' });

      expect(Dive.findByIdAndUpdate).toHaveBeenCalledWith('123', { name: 'Updated Dive' }, { new: true });
      expect(populateMock).toHaveBeenCalledWith('divingGroups boat driver');
      expect(result).toEqual(updatedDive);
    });
  });

  describe('deleteDive', () => {
    it('should delete dive by ID', async () => {
      const deletedDive = { _id: '123', name: 'To Delete' };
      (Dive.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedDive);

      const result = await DiveService.deleteDive('123');

      expect(Dive.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toEqual(deletedDive);
    });
  });
});
