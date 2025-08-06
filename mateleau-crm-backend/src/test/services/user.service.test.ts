import * as UserService from '../../services/UserService';
import { User } from '../../models/User';

jest.mock('../../models/User');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const saveMock = jest.fn().mockResolvedValue({ id: '1', name: 'Lucas' });
      (User as any).mockImplementation(() => ({ save: saveMock }));

      const result = await UserService.createUser({ name: 'Lucas' });

      expect(result).toEqual({ id: '1', name: 'Lucas' });
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: '1' }, { id: '2' }];
      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      const result = await UserService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return the user by ID', async () => {
      const mockUser = { id: '1', name: 'Lucas' };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const updatedUser = { id: '1', name: 'Updated' };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

      const result = await UserService.updateUser('1', { name: 'Updated' });

      expect(result).toEqual(updatedUser);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'Updated' }, { new: true });
    });
  });

  describe('deleteUser', () => {
    it('should delete the user by id', async () => {
      const deletedUser = { id: '1' };
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedUser);

      const result = await UserService.deleteUser('1');

      expect(result).toEqual(deletedUser);
      expect(User.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
