import { loginUser } from '../../services/AuthService';
import { User } from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  describe('loginUser', () => {
    it('should return a token and user details on successful login', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };

      // Mock the User.findOne method to return the mockUser
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      // Mock the bcrypt.compare method to return true
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      // Mock the jwt.sign method to return a token
      (jwt.sign as jest.Mock).mockReturnValue('token');

      const result = await loginUser('test@example.com', 'password');

      expect(result).toEqual({
        token: 'token',
        userId: 'userId',
        role: 'user',
      });
    });

    it('should throw an error if the user is not found', async () => {
      // Mock the User.findOne method to return null
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(loginUser('test@example.com', 'password')).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error if the password is incorrect', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };

      // Mock the User.findOne method to return the mockUser
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      // Mock the bcrypt.compare method to return false
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginUser('test@example.com', 'password')).rejects.toThrow('Invalid email or password');
    });
  });
});