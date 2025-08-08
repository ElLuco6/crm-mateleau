import { Request, Response } from 'express';
import * as TaskController from '../../controllers/TaskController';
import * as TaskService from '../../services/TaskService';

jest.mock('../../services/TaskService');

describe('TaskController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let endMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock, end: endMock })) as any;
    endMock = jest.fn();
    res = {
      status: statusMock,
      json: jsonMock,
      end: endMock,
    };
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const tasks = [{ title: 'Task 1' }];
      (TaskService.getAllTasks as jest.Mock).mockResolvedValue(tasks);

      await TaskController.getAllTasks({} as Request, res as Response);
      expect(jsonMock).toHaveBeenCalledWith(tasks);
    });

    it('should handle error', async () => {
      (TaskService.getAllTasks as jest.Mock).mockRejectedValue(new Error('fail'));

      await TaskController.getAllTasks({} as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur lors de la récupération des tâches' });
    });
  });

  describe('createTask', () => {
    it('should create task', async () => {
      const mockTask = { title: 'New Task' };
      (TaskService.createTask as jest.Mock).mockResolvedValue(mockTask);

      req = { body: { title: 'New Task' } };

      await TaskController.createTask(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockTask);
    });

    it('should handle error', async () => {
      (TaskService.createTask as jest.Mock).mockRejectedValue(new Error('fail'));
      req = { body: { title: 'fail' } };

      await TaskController.createTask(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur lors de la création de la tâche' });
    });
  });

  describe('updateTask', () => {
    it('should update task', async () => {
      const updated = { title: 'Updated Task' };
      (TaskService.updateTask as jest.Mock).mockResolvedValue(updated);

      req = { params: { id: '1' }, body: { title: 'Updated Task' } };

      await TaskController.updateTask(req as Request, res as Response);
      expect(jsonMock).toHaveBeenCalledWith(updated);
    });

    it('should handle error', async () => {
      (TaskService.updateTask as jest.Mock).mockRejectedValue(new Error('fail'));

      req = { params: { id: '1' }, body: {} };
      await TaskController.updateTask(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur lors de la mise à jour de la tâche' });
    });
  });

  describe('deleteTask', () => {
    it('should delete task and return 204', async () => {
      (TaskService.deleteTask as jest.Mock).mockResolvedValue(true);
      req = { params: { id: '1' } };

      await TaskController.deleteTask(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(endMock).toHaveBeenCalled();
    });

    it('should handle deletion error', async () => {
      (TaskService.deleteTask as jest.Mock).mockRejectedValue(new Error('fail'));
      req = { params: { id: '1' } };

      await TaskController.deleteTask(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Erreur lors de la suppression de la tâche' });
    });
  });
});
