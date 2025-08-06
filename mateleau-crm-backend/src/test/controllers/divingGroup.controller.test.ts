import { Request, Response } from 'express';
import * as DivingGroupController from '../../controllers/DivingGroupController';
import * as DivingGroupService from '../../services/DivingGroupService';
import mongoose from 'mongoose';

jest.mock('../../services/DivingGroupService');

describe('DivingGroupController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    res = { status: statusMock, json: jsonMock };
  });

  describe('createDivingGroup', () => {
    it('should create a diving group successfully', async () => {
      const mockGroup: any = {
        _id: '1',
        guide: 'g1',
        divers: ['d1'],
        groupSize: 2,
        save: jest.fn().mockResolvedValue(true)
      };

      (DivingGroupService.createDivingGroup as jest.Mock).mockResolvedValue(mockGroup);

      req = {
        body: {
          guide: 'g1',
          divers: ['d1'],
          equipmentAssignments: []
        }
      };

      jest.spyOn(mongoose.Model, 'findById').mockResolvedValue({ nature: 'mask' }) as any;

      await DivingGroupController.createDivingGroup(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockGroup);
    });
  });

  describe('getAllDivingGroups', () => {
    it('should return all groups', async () => {
      const mockGroups = [{ _id: '1' }];
      (DivingGroupService.getAllDivingGroups as jest.Mock).mockResolvedValue(mockGroups);

      await DivingGroupController.getAllDivingGroups({} as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(mockGroups);
    });
  });

  describe('getDivingGroupById', () => {
    it('should return group by id', async () => {
      const mockGroup = { _id: '1' };
      (DivingGroupService.getDivingGroupById as jest.Mock).mockResolvedValue(mockGroup);
      req = { params: { id: '1' } };

      await DivingGroupController.getDivingGroupById(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(mockGroup);
    });

    it('should return 404 if not found', async () => {
      (DivingGroupService.getDivingGroupById as jest.Mock).mockResolvedValue(null);
      req = { params: { id: '1' } };

      await DivingGroupController.getDivingGroupById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Diving group not found' });
    });
  });

  describe('updateDivingGroup', () => {
    it('should update group', async () => {
      const updated = { _id: '1' };
      (DivingGroupService.updateDivingGroup as jest.Mock).mockResolvedValue(updated);
      req = { params: { id: '1' }, body: {} };

      await DivingGroupController.updateDivingGroup(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(updated);
    });
  });

  describe('deleteDivingGroup', () => {
    it('should delete group', async () => {
      (DivingGroupService.deleteDivingGroup as jest.Mock).mockResolvedValue(true);
      req = { params: { id: '1' } };

      await DivingGroupController.deleteDivingGroup(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Diving group deleted successfully' });
    });
  });
});
