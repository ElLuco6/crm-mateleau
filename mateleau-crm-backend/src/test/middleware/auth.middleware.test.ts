import { authenticateToken, checkAdminRole } from '../../middleware/authMiddleware';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../services/AuthService';
import { User } from '../../models/User';

jest.mock('../../services/AuthService');
jest.mock('../../models/User');

describe('authMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { cookies: {}, body: {} };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should return 401 if no token', async () => {
      req.cookies = {};
      await authenticateToken(req as Request, res as Response, next as NextFunction);
      expect(res.sendStatus).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      req.cookies = { token: 'valid.token' };
      (verifyToken as jest.Mock).mockReturnValue({ id: 'user-id' });
      (User.findById as jest.Mock).mockResolvedValue(null);

      await authenticateToken(req as Request, res as Response, next as NextFunction);

      expect(res.sendStatus).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 on token verification failure', async () => {
      req.cookies = { token: 'invalid.token' };
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticateToken(req as Request, res as Response, next as NextFunction);

      expect(res.sendStatus).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should attach user and call next if valid', async () => {
  const mockUser = { _id: 'user-id', name: 'Test User' };
  (verifyToken as jest.Mock).mockReturnValue({ id: 'user-id' });
  (User.findById as jest.Mock).mockResolvedValue(mockUser);

  req = {
    cookies: { token: 'valid.token' },
    body: {} // 🔧 nécessaire pour éviter l’erreur
  };

  await authenticateToken(req as Request, res as Response, next as NextFunction);

  expect((req as Request).body.user).toEqual(mockUser);
  expect(next).toHaveBeenCalled();
});
  });

  describe('checkAdminRole', () => {
    it('should return 401 if no userId or role', async () => {
      req.cookies = {};
      await checkAdminRole(req as Request, res as Response, next as NextFunction);
      expect(res.sendStatus).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', async () => {
      req.cookies = { userId: 'user-id', role: 'user' };
      (User.findById as jest.Mock).mockResolvedValue({ role: 'user' });

      await checkAdminRole(req as Request, res as Response, next as NextFunction);

      expect(res.sendStatus).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user is admin', async () => {
      req.cookies = { userId: 'admin-id', role: 'admin' };
      (User.findById as jest.Mock).mockResolvedValue({ role: 'admin' });

      await checkAdminRole(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 on database error', async () => {
      req.cookies = { userId: 'admin-id', role: 'admin' };
      (User.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

      await checkAdminRole(req as Request, res as Response, next as NextFunction);

      expect(res.sendStatus).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
