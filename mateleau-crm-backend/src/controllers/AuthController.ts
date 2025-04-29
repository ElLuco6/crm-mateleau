import { Request, Response } from 'express';
import * as AuthService from '../services/AuthService';

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { token, userId, role } = await AuthService.loginUser(email, password);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.cookie('userId', userId, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.cookie('role', role, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ message: 'Logged in successfully', token, userId, role });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(400).json({ message: errorMessage });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token');
        res.clearCookie('userId');
        res.clearCookie('role');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        res.status(400).json({ message: errorMessage });
    }
};