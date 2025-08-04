import { Task } from '../models/Task';

export const getAllTasks = async () => {
  return await Task.find();
};

export const createTask = async (taskData: any) => {
  const newTask = new Task(taskData);
  return await newTask.save();
};

export const updateTask = async (id: string, updates: any) => {
  return await Task.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteTask = async (id: string) => {
  return await Task.findByIdAndDelete(id);
};
