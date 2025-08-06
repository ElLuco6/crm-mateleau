import * as DiverService from '../../services/DiverService';
import { Diver } from '../../models/Diver';

jest.mock('../../models/Diver');

describe('DiverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDiver', () => {
    it('should create and save a new diver', async () => {
      const mockData = { firstName: 'Jean', lastName: 'Dupont' };
      const mockSave = jest.fn().mockResolvedValue({ _id: '123', ...mockData });

      // Simule new Diver(data).save()
      // @ts-ignore
      (Diver as jest.Mock).mockImplementation(() => ({ save: mockSave }));

      const result = await DiverService.createDiver(mockData as any);

      expect(Diver).toHaveBeenCalledWith(mockData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual({ _id: '123', ...mockData });
    });
  });

  describe('createMultipleDivers', () => {
    it('should insert multiple divers', async () => {
      const divers = [{ firstName: 'Alice' }, { firstName: 'Bob' }];
      (Diver.insertMany as jest.Mock).mockResolvedValue(divers);

      const result = await DiverService.createMultipleDivers(divers as any);

      expect(Diver.insertMany).toHaveBeenCalledWith(divers);
      expect(result).toEqual(divers);
    });
  });

  describe('getAllDivers', () => {
    it('should return all divers', async () => {
      const divers = [{ firstName: 'Test' }];
      (Diver.find as jest.Mock).mockResolvedValue(divers);

      const result = await DiverService.getAllDivers();

      expect(Diver.find).toHaveBeenCalled();
      expect(result).toEqual(divers);
    });
  });

  describe('getDiverById', () => {
    it('should return a diver by ID', async () => {
      const diver = { _id: '123', firstName: 'Clara' };
      (Diver.findById as jest.Mock).mockResolvedValue(diver);

      const result = await DiverService.getDiverById('123');

      expect(Diver.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(diver);
    });
  });

  describe('updateDiver', () => {
    it('should update a diver and return the updated document', async () => {
      const updated = { _id: '123', firstName: 'Updated' };
      (Diver.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

      const result = await DiverService.updateDiver('123', { firstName: 'Updated' });

      expect(Diver.findByIdAndUpdate).toHaveBeenCalledWith('123', { firstName: 'Updated' }, { new: true });
      expect(result).toEqual(updated);
    });
  });

  describe('deleteDiver', () => {
    it('should delete a diver by ID', async () => {
      const deleted = { _id: '123' };
      (Diver.findByIdAndDelete as jest.Mock).mockResolvedValue(deleted);

      const result = await DiverService.deleteDiver('123');

      expect(Diver.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toEqual(deleted);
    });
  });
});
