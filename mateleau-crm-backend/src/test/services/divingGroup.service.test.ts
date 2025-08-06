import * as DivingGroupService from '../../services/DivingGroupService';
import { DivingGroup } from '../../models/DivingGroup';
import mongoose from 'mongoose';

jest.mock('../../models/DivingGroup');

describe('DivingGroupService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDivingGroup', () => {
  it('should create a diving group', async () => {
    const saveMock = jest.fn().mockResolvedValue({ id: '1' });
    (DivingGroup as any).mockImplementation(() => ({ save: saveMock }));

    const result = await DivingGroupService.createDivingGroup({ guide: new mongoose.Types.ObjectId(), divers: [] });
    expect(result).toEqual({ id: '1' });
    expect(saveMock).toHaveBeenCalled();
  });
});

  describe('getAllDivingGroups', () => {
    it('should return all diving groups', async () => {
      const mockGroups = [{ id: '1' }, { id: '2' }];
      const populateMock = jest.fn().mockResolvedValue(mockGroups);
      (DivingGroup.find as jest.Mock).mockReturnValue({ populate: populateMock });

      const result = await DivingGroupService.getAllDivingGroups();
      expect(result).toEqual(mockGroups);
      expect(DivingGroup.find).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalledWith('guide divers');
    });
  });

  describe('getDivingGroupById', () => {
    it('should return a group by id', async () => {
      const mockGroup = { id: '1' };
      const populateMock = jest.fn().mockResolvedValue(mockGroup);
      (DivingGroup.findById as jest.Mock).mockReturnValue({ populate: populateMock });

      const result = await DivingGroupService.getDivingGroupById('1');
      expect(result).toEqual(mockGroup);
      expect(DivingGroup.findById).toHaveBeenCalledWith('1');
      expect(populateMock).toHaveBeenCalledWith('guide divers');
    });
  });

  describe('updateDivingGroup', () => {
  it('should update a group', async () => {
    const updatedGroup = { id: '1', guide: 'UpdatedGuide' };
    const populateMock = jest.fn().mockResolvedValue(updatedGroup);
    (DivingGroup.findByIdAndUpdate as jest.Mock).mockReturnValue({ populate: populateMock });

    const result = await DivingGroupService.updateDivingGroup('1', { guide: new mongoose.Types.ObjectId() });
    expect(result).toEqual(updatedGroup);
    expect(DivingGroup.findByIdAndUpdate).toHaveBeenCalled();
    expect(populateMock).toHaveBeenCalledWith('guide divers');
  });
});

  describe('deleteDivingGroup', () => {
    it('should delete a group by id', async () => {
      const deletedGroup = { id: '1' };
      (DivingGroup.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedGroup);

      const result = await DivingGroupService.deleteDivingGroup('1');
      expect(result).toEqual(deletedGroup);
      expect(DivingGroup.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
