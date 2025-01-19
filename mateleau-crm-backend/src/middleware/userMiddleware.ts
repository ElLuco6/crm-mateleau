import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';

const saltRounds = 10;

export const encryptPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.password) {
            console.log(req)
            return res.status(400).json({ message: 'Password is required' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
};

export const checkEmailUnique = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        next();
    } catch (error) {
        next(error);
    }
};