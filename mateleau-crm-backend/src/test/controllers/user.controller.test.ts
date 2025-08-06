import * as UserController from '../../controllers/UserControllers';
import * as UserService from '../../services/UserService';
import { Request, Response } from 'express';

jest.mock('../../services/UserService');

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = {};
    res = { status: statusMock, json: jsonMock };
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return 201', async () => {
      (UserService.createUser as jest.Mock).mockResolvedValue({ id: '1' });
      req.body = { name: 'Test' };

      await UserController.createUser(req as Request, res as Response);

      expect(UserService.createUser).toHaveBeenCalledWith({ name: 'Test' });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: '1' }];
      (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      await UserController.getAllUsers(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe('getOneUser', () => {
    it('should return a user by ID', async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue({ id: '1' });
      req.params = { id: '1' };

      await UserController.getOneUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ id: '1' });
    });

    it('should return 404 if user not found', async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue(null);
      req.params = { id: '1' };

      await UserController.getOneUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user from cookie', async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue({ id: 'cookie-user' });
      req.cookies = { userId: 'cookie-user' };

      await UserController.getCurrentUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ id: 'cookie-user' });
    });

    it('should return 404 if not found', async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue(null);
      req.cookies = { userId: 'unknown' };

      await UserController.getCurrentUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('updateCurrentUser', () => {
    it('should update and return current user', async () => {
      (UserService.updateUser as jest.Mock).mockResolvedValue({ id: 'updated' });
      req.cookies = { userId: 'cookie-id' };
      req.body = { name: 'New' };

      await UserController.updateCurrentUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ id: 'updated' });
    });

    it('should return 404 if not found', async () => {
      (UserService.updateUser as jest.Mock).mockResolvedValue(null);
      req.cookies = { userId: 'unknown' };
      req.body = {};

      await UserController.updateCurrentUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('updateUser', () => {
    it('should update user by ID', async () => {
      (UserService.updateUser as jest.Mock).mockResolvedValue({ id: 'updated' });
      req.params = { id: '1' };
      req.body = { name: 'Updated' };

      await UserController.updateUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ id: 'updated' });
    });

    it('should return 404 if user not found', async () => {
      (UserService.updateUser as jest.Mock).mockResolvedValue(null);
      req.params = { id: '1' };
      req.body = {};

      await UserController.updateUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user by ID', async () => {
      (UserService.deleteUser as jest.Mock).mockResolvedValue({ id: 'deleted' });
      req.params = { id: '1' };

      await UserController.deleteUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 404 if user not found', async () => {
      (UserService.deleteUser as jest.Mock).mockResolvedValue(null);
      req.params = { id: '1' };

      await UserController.deleteUser(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
});
