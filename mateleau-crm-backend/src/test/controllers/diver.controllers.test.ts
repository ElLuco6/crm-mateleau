import * as DiverController from '../../controllers/DiverController';
import * as DiverService from '../../services/DiverService';
import { Request, Response } from 'express';

jest.mock('../../services/DiverService');

describe('DiverController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    res = { status: statusMock, json: jsonMock };
  });

  describe('createDiver', () => {
    it('should create a diver', async () => {
      const mockDiver = { firstName: 'Jean' };
      req.body = mockDiver;
      (DiverService.createDiver as jest.Mock).mockResolvedValue(mockDiver);

      await DiverController.createDiver(req as Request, res as Response);

      expect(DiverService.createDiver).toHaveBeenCalledWith(mockDiver);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockDiver);
    });
  });

  describe('createMultipleDivers', () => {
    it('should create multiple divers', async () => {
      const divers = [{ firstName: 'A' }, { firstName: 'B' }];
      req.body = { divers };
      (DiverService.createMultipleDivers as jest.Mock).mockResolvedValue(divers);

      await DiverController.createMultipleDivers(req as Request, res as Response);

      expect(DiverService.createMultipleDivers).toHaveBeenCalledWith(divers);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(divers);
    });
  });

  describe('getAllDivers', () => {
    it('should return all divers', async () => {
      const divers = [{ firstName: 'Alice' }];
      (DiverService.getAllDivers as jest.Mock).mockResolvedValue(divers);

      await DiverController.getAllDivers(req as Request, res as Response);

      expect(DiverService.getAllDivers).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(divers);
    });
  });

  describe('getDiverById', () => {
    it('should return a diver by ID', async () => {
      const diver = { firstName: 'Bob' };
      req.params = { id: '123' };
      (DiverService.getDiverById as jest.Mock).mockResolvedValue(diver);

      await DiverController.getDiverById(req as Request, res as Response);

      expect(DiverService.getDiverById).toHaveBeenCalledWith('123');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(diver);
    });

    it('should return 404 if diver not found', async () => {
      req.params = { id: '404' };
      (DiverService.getDiverById as jest.Mock).mockResolvedValue(null);

      await DiverController.getDiverById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Diver not found' });
    });
  });

  describe('updateDiver', () => {
    it('should update a diver', async () => {
      req.params = { id: '123' };
      req.body = { firstName: 'Updated' };
      const updated = { firstName: 'Updated' };
      (DiverService.updateDiver as jest.Mock).mockResolvedValue(updated);

      await DiverController.updateDiver(req as Request, res as Response);

      expect(DiverService.updateDiver).toHaveBeenCalledWith('123', req.body);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updated);
    });

    it('should return 404 if diver not found', async () => {
      req.params = { id: '404' };
      req.body = {};
      (DiverService.updateDiver as jest.Mock).mockResolvedValue(null);

      await DiverController.updateDiver(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Diver not found' });
    });
  });

  describe('deleteDiver', () => {
    it('should delete a diver', async () => {
      req.params = { id: '123' };
      (DiverService.deleteDiver as jest.Mock).mockResolvedValue(true);

      await DiverController.deleteDiver(req as Request, res as Response);

      expect(DiverService.deleteDiver).toHaveBeenCalledWith('123');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Diver deleted successfully' });
    });

    it('should return 404 if diver not found', async () => {
      req.params = { id: '404' };
      (DiverService.deleteDiver as jest.Mock).mockResolvedValue(null);

      await DiverController.deleteDiver(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Diver not found' });
    });
  });
});
