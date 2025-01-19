import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/AuthService';
import { User } from '../models/User';

export const authenticateToken = async  (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    try {
        const decodedToken = verifyToken(token);
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.sendStatus(401); // Unauthorized
        }
        req.body.user = user;
        next();
    } catch (err) {
        return res.sendStatus(403); // Forbidden
    }
};

export const checkAdminRole = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, role } = req.cookies;

    if (!userId || !role) {
        return res.sendStatus(401); // Unauthorized
    }

    try {
        const user = await User.findById(userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            return res.sendStatus(403); // Forbidden
        }
    } catch (err) {
        return res.sendStatus(403); // Forbidden
    }
};