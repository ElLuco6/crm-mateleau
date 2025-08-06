import { loginUser, logoutUser } from '../../controllers/AuthController';
import * as AuthService from '../../services/AuthService';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let cookieMock: jest.Mock;
  let clearCookieMock: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
    };

    jsonMock = jest.fn();
    cookieMock = jest.fn();
    clearCookieMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;

    res = {
      status: statusMock,
      json: jsonMock,
      cookie: cookieMock,
      clearCookie: clearCookieMock,
    };
  });

  describe('loginUser', () => {
    it('should login and set cookies', async () => {
      // Mock du service d’auth
      const mockData = {
        token: 'fake-token',
        userId: 'user123',
        role: 'admin' as 'admin',
      };
      jest.spyOn(AuthService, 'loginUser').mockResolvedValue(mockData);

      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      await loginUser(req as Request, res as Response);

      expect(AuthService.loginUser).toHaveBeenCalledWith('test@example.com', 'password123');

      expect(cookieMock).toHaveBeenCalledWith('token', mockData.token, expect.any(Object));
      expect(cookieMock).toHaveBeenCalledWith('userId', mockData.userId, expect.any(Object));
      expect(cookieMock).toHaveBeenCalledWith('role', mockData.role, expect.any(Object));

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Logged in successfully',
        ...mockData,
      });
    });

    it('should handle login error', async () => {
      jest.spyOn(AuthService, 'loginUser').mockRejectedValue(new Error('Invalid credentials'));

      req.body = {
        email: 'fail@example.com',
        password: 'wrongpass',
      };

      await loginUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('logoutUser', () => {
    it('should clear cookies and return success', async () => {
      await logoutUser(req as Request, res as Response);

      expect(clearCookieMock).toHaveBeenCalledWith('token');
      expect(clearCookieMock).toHaveBeenCalledWith('userId');
      expect(clearCookieMock).toHaveBeenCalledWith('role');

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
  });
});
