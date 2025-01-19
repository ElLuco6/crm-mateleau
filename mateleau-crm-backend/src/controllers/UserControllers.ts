import { Request, Response } from 'express';
import * as UserService from '../services/UserService';

// POST /api/users
export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await UserService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// GET /api/users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// GET /api/users/:id
export const getOneUser = async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// GET /api/users/me
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserById(req.cookies.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// PUT /api/users/me
export const updateCurrentUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await UserService.updateUser(req.cookies.userId, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};




// PUT /api/users/:id
export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await UserService.updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

// DELETE /api/users/:id
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await UserService.deleteUser(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};