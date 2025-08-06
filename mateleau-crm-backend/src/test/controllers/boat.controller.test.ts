import * as BoatController from '../../controllers/BoatController';
import * as BoatService from '../../services/BoatService';
import { Request, Response } from 'express';

jest.mock('../../services/BoatService');

describe('BoatController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = { params: {}, body: {} };
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    res = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();
  });

  describe('createBoat', () => {
    it('should create a boat', async () => {
      const mockBoat = { name: 'Test Boat' };
      (BoatService.createBoat as jest.Mock).mockResolvedValue(mockBoat);
      req.body = { name: 'Test Boat' };

      await BoatController.createBoat(req as Request, res as Response);

      expect(BoatService.createBoat).toHaveBeenCalledWith(req.body);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockBoat);
    });

    it('should handle errors', async () => {
      (BoatService.createBoat as jest.Mock).mockRejectedValue(new Error('DB error'));

      await BoatController.createBoat(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('getAllBoats', () => {
    it('should return all boats', async () => {
      const boats = [{ name: 'Boat 1' }];
      (BoatService.getAllBoats as jest.Mock).mockResolvedValue(boats);

      await BoatController.getAllBoats(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(boats);
    });
  });

  describe('getBoatById', () => {
    it('should return a boat by ID', async () => {
      const boat = { name: 'Boat A' };
      (BoatService.getBoatById as jest.Mock).mockResolvedValue(boat);
      req.params = { id: '123' };

      await BoatController.getBoatById(req as Request, res as Response);

      expect(BoatService.getBoatById).toHaveBeenCalledWith('123');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(boat);
    });

    it('should return 404 if boat not found', async () => {
      (BoatService.getBoatById as jest.Mock).mockResolvedValue(null);
      req.params = { id: 'notfound' };

      await BoatController.getBoatById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Boat not found' });
    });
  });

  describe('updateBoat', () => {
    it('should update a boat', async () => {
      const updatedBoat = { name: 'Updated Boat' };
      (BoatService.updateBoat as jest.Mock).mockResolvedValue(updatedBoat);
      req.params = { id: '123' };
      req.body = { name: 'Updated Boat' };

      await BoatController.updateBoat(req as Request, res as Response);

      expect(BoatService.updateBoat).toHaveBeenCalledWith('123', req.body);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedBoat);
    });

    it('should return 404 if boat not found', async () => {
      (BoatService.updateBoat as jest.Mock).mockResolvedValue(null);
      req.params = { id: 'notfound' };

      await BoatController.updateBoat(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Boat not found' });
    });
  });

  describe('deleteBoat', () => {
    it('should delete a boat', async () => {
      (BoatService.deleteBoat as jest.Mock).mockResolvedValue(true);
      req.params = { id: '123' };

      await BoatController.deleteBoat(req as Request, res as Response);

      expect(BoatService.deleteBoat).toHaveBeenCalledWith('123');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Boat deleted successfully' });
    });

    it('should return 404 if boat not found', async () => {
      (BoatService.deleteBoat as jest.Mock).mockResolvedValue(null);
      req.params = { id: 'notfound' };

      await BoatController.deleteBoat(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Boat not found' });
    });
  });
});
