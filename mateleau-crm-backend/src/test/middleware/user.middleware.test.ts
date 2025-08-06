import { encryptPassword, checkEmailUnique } from '../../middleware/userMiddleware';
import { User } from '../../models/User';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../models/User');
jest.mock('bcrypt');

describe('user.middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  // ===========================
  // encryptPassword
  // ===========================
  describe('encryptPassword', () => {
    it('should hash the password and call next', async () => {
      req.body = { password: 'plainPassword' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await encryptPassword(req as Request, res as Response, next as NextFunction);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
      expect(req.body?.password).toBe('hashedPassword');
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if no password provided', async () => {
      req.body = {};

      await encryptPassword(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password is required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      req.body = { password: 'fail' };
      const error = new Error('hash error');
      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await encryptPassword(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ===========================
  // checkEmailUnique
  // ===========================
  describe('checkEmailUnique', () => {
    it('should call next if email is unique', async () => {
      req.body = { email: 'test@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await checkEmailUnique(req as Request, res as Response, next as NextFunction);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if email already exists', async () => {
      req.body = { email: 'test@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue({ _id: 'existingUser' });

      await checkEmailUnique(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      const error = new Error('DB error');
      req.body = { email: 'fail@example.com' };
      (User.findOne as jest.Mock).mockRejectedValue(error);

      await checkEmailUnique(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
