import * as TaskService from '../../services/TaskService';
import { Task } from '../../models/Task';

jest.mock('../../models/Task');

describe('TaskService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [{ id: '1' }, { id: '2' }];
      (Task.find as jest.Mock).mockResolvedValue(mockTasks);

      const result = await TaskService.getAllTasks();

      expect(result).toEqual(mockTasks);
      expect(Task.find).toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const saveMock = jest.fn().mockResolvedValue({ id: '1', title: 'Test' });
      (Task as any).mockImplementation(() => ({ save: saveMock }));

      const result = await TaskService.createTask({ title: 'Test' });

      expect(result).toEqual({ id: '1', title: 'Test' });
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should update and return the task', async () => {
      const updatedTask = { id: '1', title: 'Updated' };
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

      const result = await TaskService.updateTask('1', { title: 'Updated' });

      expect(result).toEqual(updatedTask);
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('1', { title: 'Updated' }, { new: true });
    });
  });

  describe('deleteTask', () => {
    it('should delete the task by id', async () => {
      const deletedTask = { id: '1' };
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedTask);

      const result = await TaskService.deleteTask('1');

      expect(result).toEqual(deletedTask);
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
