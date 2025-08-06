import * as EquipmentController from '../../controllers/EquipmentController';
import * as EquipmentService from '../../services/EquipmentService';
import { Request, Response } from 'express';

jest.mock('../../services/EquipmentService');

describe('EquipmentController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createEquipment', () => {
    it('should create equipment successfully', async () => {
      const newEquipment = { id: '1', reference: 'EQ-01' };
      req.body = { reference: 'EQ-01' };
      (EquipmentService.createEquipment as jest.Mock).mockResolvedValue(newEquipment);

      await EquipmentController.createEquipment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newEquipment);
    });
  });

  describe('createMultipleEquipment', () => {
    it('should create multiple equipment successfully', async () => {
      const equipment = [{ reference: 'EQ-01' }, { reference: 'EQ-02' }];
      req.body = { equipment };
      (EquipmentService.createMultipleEquipment as jest.Mock).mockResolvedValue(equipment);

      await EquipmentController.createMultipleEquipment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(equipment);
    });
  });

  describe('getAllEquipment', () => {
    it('should return all equipment', async () => {
      const all = [{ reference: 'EQ-01' }];
      (EquipmentService.getAllEquipment as jest.Mock).mockResolvedValue(all);

      await EquipmentController.getAllEquipment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(all);
    });
  });

  describe('getEquipmentById', () => {
    it('should return one equipment', async () => {
      const eq = { id: '1', reference: 'EQ-01' };
      req.params = { id: '1' };
      (EquipmentService.getEquipmentById as jest.Mock).mockResolvedValue(eq);

      await EquipmentController.getEquipmentById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(eq);
    });

    it('should return 404 if equipment not found', async () => {
      req.params = { id: '1' };
      (EquipmentService.getEquipmentById as jest.Mock).mockResolvedValue(null);

      await EquipmentController.getEquipmentById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Equipment not found' });
    });
  });

  describe('updateEquipment', () => {
    it('should update equipment', async () => {
      const updated = { id: '1', reference: 'Updated' };
      req.params = { id: '1' };
      req.body = { reference: 'Updated' };
      (EquipmentService.updateEquipment as jest.Mock).mockResolvedValue(updated);

      await EquipmentController.updateEquipment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return 404 if update failed', async () => {
      req.params = { id: '1' };
      req.body = { reference: 'Updated' };
      (EquipmentService.updateEquipment as jest.Mock).mockResolvedValue(null);

      await EquipmentController.updateEquipment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Equipment not found' });
    });
  });

  describe('deleteEquipment', () => {
    it('should delete equipment successfully', async () => {
      req.params = { id: '1' };
      (EquipmentService.deleteEquipment as jest.Mock).mockResolvedValue(true);

      await EquipmentController.deleteEquipment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Equipment deleted successfully' });
    });

    it('should return 404 if equipment not found', async () => {
      req.params = { id: '1' };
      (EquipmentService.deleteEquipment as jest.Mock).mockResolvedValue(null);

      await EquipmentController.deleteEquipment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Equipment not found' });
    });
  });
});
