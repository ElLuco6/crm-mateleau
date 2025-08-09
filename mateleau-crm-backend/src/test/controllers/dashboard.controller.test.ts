import * as DashboardController from '../../controllers/DashboardController';
import * as DashboardService from '../../services/DashboardService';
import { Request, Response } from 'express';

jest.mock('../../services/DashboardService');

describe('DashboardController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    res = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();
  });

  describe('getTodayDashboard', () => {
    it('should return today dashboard data', async () => {
      const mockData = {
        dives: [{ id: 'd1' }],
        equipmentToReview: [{ id: 'e1' }],
        boatsToReview: [{ id: 'b1' }],
      };

      (DashboardService.getTodayDashboardData as jest.Mock).mockResolvedValue(mockData);

      await DashboardController.getTodayDashboard(req as Request, res as Response);

      expect(DashboardService.getTodayDashboardData).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(mockData);
    });

    it('should handle service error', async () => {
      (DashboardService.getTodayDashboardData as jest.Mock).mockRejectedValue({ message: 'fail' });

      await DashboardController.getTodayDashboard(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur serveur' });
    });
  });

  describe('getWeeklyDashboard', () => {
    it('should return weekly dashboard data', async () => {
      const mockData = {
        dives: [{ id: 'dW' }],
        equipmentToReview: [{ id: 'eW' }],
        boatsToReview: [{ id: 'bW' }],
      };

      (DashboardService.getWeeklyDashboardData as jest.Mock).mockResolvedValue(mockData);

      await DashboardController.getWeeklyDashboard(req as Request, res as Response);

      expect(DashboardService.getWeeklyDashboardData).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(mockData);
    });

    it('should handle service error', async () => {
      (DashboardService.getWeeklyDashboardData as jest.Mock).mockRejectedValue(new Error('fail'));

      await DashboardController.getWeeklyDashboard(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur serveur' });
    });
  });
});
