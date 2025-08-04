// controllers/taskController.js
import { Request, Response } from 'express';
import * as TaskService from '../services/TaskService';


export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskService.getAllTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await TaskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la tâche' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const updated = await TaskService.updateTask(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await TaskService.deleteTask(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la tâche' });
  }
};
