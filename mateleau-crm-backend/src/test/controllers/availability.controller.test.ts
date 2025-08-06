import * as AvailabilityController from '../../controllers/AvailabilityController';
import * as AvailabilityService from '../../services/AvailabityService';
import { Request, Response } from 'express';

jest.mock('../../services/AvailabityService');

describe('AvailabilityController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;

    req = { query: {} };
    res = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();
  });

  const endpoints: [keyof typeof AvailabilityController, keyof typeof AvailabilityService][] = [
    ['getAvailableBoats', 'getAvailableBoats'],
    ['getAvailableDivingGroups', 'getAvailableDivingGroups'],
    ['getAvailableEquipment', 'getAvailableEquipment'],
    ['getAvailableDivers', 'getAvailableDivers'],
    ['getAvailableUsers', 'getAvailableUsers'],
  ];

  endpoints.forEach(([controllerName, serviceName]) => {
    describe(controllerName, () => {
      it('should return 400 if date or duration missing', async () => {
        req.query = { date: '2025-08-06' }; // duration manquant
        // @ts-ignore
        await AvailabilityController[controllerName](req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ message: 'Date and duration are required' });
      });

      it('should return available data from service', async () => {
        const mockData = [{ id: 1, name: 'Test' }];
        (AvailabilityService[serviceName] as jest.Mock).mockResolvedValue(mockData);

        req.query = { date: '2025-08-06', duration: '60' };
        // @ts-ignore
        await AvailabilityController[controllerName](req, res);

        expect(AvailabilityService[serviceName]).toHaveBeenCalledWith('2025-08-06');
        expect(jsonMock).toHaveBeenCalledWith(mockData);
      });

      it('should return 500 on service error', async () => {
        (AvailabilityService[serviceName] as jest.Mock).mockRejectedValue(new Error('DB error'));

        req.query = { date: '2025-08-06', duration: '60' };
        // @ts-ignore
        await AvailabilityController[controllerName](req, res);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ message: 'DB error' });
      });
    });
  });
});
