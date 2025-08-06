import mongoose from 'mongoose';
import { Spot } from '../../models/Spot';
import * as SpotService from '../../services/SpotService';
import * as SpotController from '../../controllers/SpotController';
import { Request, Response } from 'express';

jest.mock('../../services/SpotService');

let req: Partial<Request>;
let res: Partial<Response>;
let statusMock: jest.Mock;
let jsonMock: jest.Mock;
let sendMock: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  jsonMock = jest.fn();
  sendMock = jest.fn();
  statusMock = jest.fn(() => ({ json: jsonMock, send: sendMock })) as any;
  res = { status: statusMock, json: jsonMock, send: sendMock };
});

describe('SpotController', () => {
  describe('createSpot', () => {
    it('should create a spot successfully', async () => {
      const spot = { name: 'Nice Spot', coordinates: { lat: 43.7, lng: 7.3 } };
      (SpotService.createSpot as jest.Mock).mockResolvedValue(spot);
      req = { body: spot };

      await SpotController.createSpot(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(spot);
    });

    it('should handle errors when creating', async () => {
      (SpotService.createSpot as jest.Mock).mockRejectedValue(new Error('fail'));
      req = { body: {} };

      await SpotController.createSpot(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur création Spot' });
    });
  });

  describe('getAllSpots', () => {
    it('should return all spots', async () => {
      const mockSpots = [{ name: 'A' }, { name: 'B' }];
      (SpotService.getAllSpots as jest.Mock).mockResolvedValue(mockSpots);

      await SpotController.getAllSpots({} as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(mockSpots);
    });

    it('should handle error in getting all', async () => {
      (SpotService.getAllSpots as jest.Mock).mockRejectedValue(new Error('fail'));

      await SpotController.getAllSpots({} as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur récupération Spots' });
    });
  });

  describe('getSpotById', () => {
    it('should return one spot', async () => {
      const spot = { name: 'X' };
      (SpotService.getSpotById as jest.Mock).mockResolvedValue(spot);
      req = { params: { id: '123' } };

      await SpotController.getSpotById(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(spot);
    });

    it('should return 404 if not found', async () => {
      (SpotService.getSpotById as jest.Mock).mockResolvedValue(null);
      req = { params: { id: '123' } };

      await SpotController.getSpotById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Spot non trouvée' });
    });

    it('should handle error', async () => {
      (SpotService.getSpotById as jest.Mock).mockRejectedValue(new Error('fail'));
      req = { params: { id: '123' } };

      await SpotController.getSpotById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur récupération Spot' });
    });
  });

  describe('updateSpot', () => {
    it('should update a spot successfully', async () => {
      const updated = { name: 'Updated' };
      (SpotService.updateSpot as jest.Mock).mockResolvedValue(updated);
      req = { params: { id: '1' }, body: { name: 'Updated' } };

      await SpotController.updateSpot(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(updated);
    });

    it('should return 404 if not found', async () => {
      (SpotService.updateSpot as jest.Mock).mockResolvedValue(null);
      req = { params: { id: '1' }, body: {} };

      await SpotController.updateSpot(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Spot non trouvée' });
    });

    it('should handle error', async () => {
      (SpotService.updateSpot as jest.Mock).mockRejectedValue(new Error('fail'));
      req = { params: { id: '1' }, body: {} };

      await SpotController.updateSpot(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur mise à jour Spot' });
    });
  });

  describe('deleteSpot', () => {
    it('should delete a spot successfully', async () => {
      (SpotService.deleteSpot as jest.Mock).mockResolvedValue(true);
      req = { params: { id: '1' } };

      await SpotController.deleteSpot(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it('should handle deletion error', async () => {
      (SpotService.deleteSpot as jest.Mock).mockRejectedValue(new Error('fail'));
      req = { params: { id: '1' } };

      await SpotController.deleteSpot(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur suppression Spot' });
    });
  });
});
