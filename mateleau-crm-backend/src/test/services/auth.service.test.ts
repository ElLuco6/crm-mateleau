import * as AuthService from '../../services/AuthService';
import { User } from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../models/User'); // mock mongoose model
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'admin',
  };

  describe('loginUser', () => {
    it('should login successfully with correct credentials', async () => {
      // Mock findOne → retourne un user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      // Mock bcrypt.compare → valide le mot de passe
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      // Mock jwt.sign → retourne un token
      (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

      const result = await AuthService.loginUser('test@example.com', 'password123');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, role: mockUser.role },
        expect.any(String),
        { expiresIn: '1h' }
      );

      expect(result).toEqual({
        token: 'fake-jwt-token',
        userId: mockUser._id,
        role: mockUser.role,
      });
    });

    it('should throw error if user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.loginUser('unknown@example.com', 'pass')).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw error if password is invalid', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(AuthService.loginUser('test@example.com', 'wrongpass')).rejects.toThrow(
        'Invalid email or password'
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify token and return payload', () => {
      const fakePayload = { id: 'user123', role: 'admin' };
      (jwt.verify as jest.Mock).mockReturnValue(fakePayload);

      const result = AuthService.verifyToken('token');

      expect(jwt.verify).toHaveBeenCalledWith('token', expect.any(String));
      expect(result).toEqual(fakePayload);
    });
  });
});
